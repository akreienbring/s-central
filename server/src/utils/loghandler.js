/*
  Author: André Kreienbring
  Handle log messages received via UDP from a Shelly device.
  Relevant logs are forwarded to the frontend client.
*/
const wsclient = require("@ws/client/wsclient");

const lastScriptPerDevice = {};
const errorBuffer = {};

/**
  When ShellyBroker receives an UDP message it will be handled by this function.
  If a device exists with the given source address, then the 10 recent log messages 
  will be added to the according script object.
  ATTENTION: This only works correct, if the log output contains the name of the script.
  e.g. "logPrefix: [SCRIPTNAME]" where [SCRIPTNAME] equals the name of an existing script!
  @param {Object} device The existing device that the log must be added to
  @param {Buffer} msg A message that was received over UDP
*/
function handleLogMessage(device, msg) {
  if (typeof errorBuffer[device.id] === "undefined")
    errorBuffer[device.id] = [];

  /*
    This checks for the prefix, that is added to each log message of a script.
  */
  let script = device.scripts.find((script) => {
    return msg.includes(`2|${script.name} (#id:${script.id})`);
  });

  if (typeof script === "undefined") {
    // new since firmware 1.7.0?
    const position = msg.search("script:");
    if (position !== -1) {
      const scriptId = msg.substring(position + 7, position + 8);
      script = device.scripts.find((script) => {
        return script.id === parseInt(scriptId);
      });
    }
  }

  /*
    Some log messages (e.g. error messages) don't include the script name.
    In this case the last detected script of the device will be assumed
  */
  if (typeof script !== "undefined") {
    lastScriptPerDevice[device.id] = script;
    errorBuffer[device.id] = [];
  }

  if (
    typeof script === "undefined" &&
    typeof lastScriptPerDevice[device.id] !== "undefined"
  )
    script = lastScriptPerDevice[device.id];

  if (typeof script !== "undefined") {
    if (typeof script.logmessages === "undefined") script.logmessages = [];

    // The original message may contain more than 1 log information divided by the device id
    let logmessages = msg.toString().split(device.id);
    logmessages = logmessages.filter((e) => e !== "");

    for (let logmessage of logmessages) {
      logmessage = logmessage.substring(
        logmessage.indexOf("|") - 1,
        logmessage.length
      );

      // Check if script is stopped because of an error
      checkDeviceError(device, script, logmessage);

      // Filter out unwanted messages
      if (
        logmessage.includes("|shelly") ||
        logmessage.includes("|shos") ||
        !logmessage.startsWith("2|")
      )
        break;

      // Add 10 log messages to the according script object of the device
      if (script.logmessages.length > 10) script.logmessages.splice(0, 1);

      logmessage = logmessage.substring(2, logmessage.length);

      /* a
        Assume that errors start with '|2' and do not contain the script name
        That was the case in firmware versions < 1.7.0
        In this case we collect the error messages in a buffer until the script stops
      */
      if (!logmessage.includes(script.name)) {
        errorBuffer[device.id].push(logmessage);
      }

      /*
        By pushing the message into the logmessages array of the script
        it will be automatically updated in the internal device list
      */
      script.logmessages.push({
        ts: Math.floor(new Date().getTime() / 1000),
        msg: logmessage,
      });

      /*
      Update the device on the Dashboard client by sending the message via the wsclient to the wshandler!
      This way we prevent circle requirements, because wshandler requires the shellyConnector!
      */
      const wsmessage = {
        event: "ShellyUpdate",
        type: "log",
        data: {
          source: "Loghandler",
          message: `Script ${script.name} has a new log message`,
          device,
        },
      };
      wsclient.send(wsmessage);
    }
  }
}

/**
  Checks if a script was stopped due to an error by looking for a specific pattern  like
  shelly_notification:162 Status change of script:1: {"id":1,"running":false}
  If yes, the error text is send as a notification.
  @param {object} device The device that logged a message.
  @param {string} logmessage The logmessage that was logged by the given device.
*/
function checkDeviceError(device, script, logmessage) {
  if (
    logmessage.includes("{") &&
    logmessage.includes("}") &&
    logmessage.includes('"running":false') &&
    logmessage.includes(`Status change of script:${script.id}:`)
  ) {
    const sScriptNotification = logmessage.substring(
      logmessage.indexOf("{"),
      logmessage.indexOf("}") + 1
    );

    // Assume that this is a notification that the script was stopped
    try {
      const oScriptNotification = JSON.parse(sScriptNotification);

      if (
        typeof oScriptNotification.running !== "undefined" &&
        !oScriptNotification.running
      ) {
        if (
          errorBuffer[device.id].length > 0 ||
          typeof oScriptNotification.error_msg !== "undefined"
        ) {
          /* The format of log messages that indicate an error has changed with firmware 1.7.0
             - For <1.7.0 this is only an error when error messages were collected before.
               Construct the error from the buffer
             - For >= 1.7.0 we can use the error_msg property of the notification
          */
          let error_msg = oScriptNotification.error_msg;
          if (typeof error_msg === "undefined") {
            errorBuffer[device.id].forEach((logmessage, index) => {
              if (index > 0) error_msg += "\n";
              error_msg += logmessage;
            });

            errorBuffer[device.id] = [];
          }

          console.error(
            `Error of ${device.cname} in script with id  ${script.id}: ${error_msg}`
          );

          /*
            Create a notification of the Script error in the database
          */
          const wsmessage = {
            event: "notification create",
            data: {
              name: "Loghandler",
              message: `Error of ${device.cname} in script with id  ${script.id}`,
              notification: {
                type: "script-error",
                device_ip: device.ip,
                device_cname: device.cname,
                script_id: script.id,
                notification: error_msg,
              },
            },
          };
          wsclient.send(wsmessage);
        }
      }
    } catch (error) {
      // Do nothing. Script is still running;
    }
  }
}

module.exports = {
  handleLogMessage,
};
