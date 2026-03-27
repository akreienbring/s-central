/*
  Author: André Kreienbring
  Checks a 'Notify(Full)Status' websocket message for changes that must be
  applied to a device. (Script and Switch status).
  For Gen1 devices the NotifyFullStatus is used. For Gen2+ devices NotifyStatus because
  it is a direct response to a status change.
  As wshandler sets the new status on a device directly when the client sends it,
  this should never change anything! Hence it can be seen as a fallback strategy.

  Firmware information is only updated when a NotifyFullStatus message is received.
*/

/**
  Called by wshandler if a 'Notify(Full)Status' from a Shelly device arrives
  that contains data regarding the switches.
  The current state of the switches of the device is updated on the device.
  @param {object} device The device that send the websocket message.
  @param {object} msg The message that was received from a device*/
function update(device, msg) {
  const params = msg.params;
  const method = msg.method;

  if (
    (method === "NotifyFullStatus" && device.gen === 1) ||
    (method === "NotifyStatus" && device.gen >= 2)
  ) {
    if (device.scripts.length > 0) {
      /*
        check the status of the scripts of the device.
        Get the id from the device script and use the value
        of the last NotifyFullStatus Event
      */
      let currentScript;
      Object.values(device.scripts).forEach((script) => {
        currentScript = params[`script:${script.id}`];

        // update the status of the script if it was not altered before
        // A difference of 2 seconds is considered as a manual change
        const doUpdate =
          device.gen >= 2
            ? true
            : typeof script.ts === "undefined" || params.ts - script.ts > 2;
        if (typeof currentScript?.running !== "undefined" && doUpdate)
          script.running = currentScript.running;
      });
    }

    if (device.switches.length > 0) {
      let currentSwitch;
      device.switches.forEach((aSwitch) => {
        currentSwitch =
          params[`switch:${aSwitch.id}`] || params[`rgbw:${aSwitch.id}`];

        // update the values of the switch if it was not altered manually before
        // A difference of more than 2 seconds is considered a manual change
        const doUpdate =
          device.gen >= 2
            ? true
            : typeof aSwitch.ts === "undefined" || params.ts - aSwitch.ts > 2;
        if (doUpdate) {
          if (doUpdate) {
            if (
              typeof currentSwitch?.output !== "undefined" &&
              aSwitch.output !== currentSwitch.output
            ) {
              aSwitch.output = currentSwitch.output;
              console.log(
                `Switch ${aSwitch.key} of device ${device.cname} output was set to ${aSwitch.output}`,
              );
            }
            if (
              typeof currentSwitch?.brightness !== "undefined" &&
              aSwitch.brightness !== currentSwitch.brightness
            ) {
              aSwitch.brightness = currentSwitch.brightness;
              console.log(
                `Switch ${aSwitch.key} of device ${device.cname} brightness was set to ${aSwitch.brightness}`,
              );
            }
            if (
              typeof currentSwitch?.white !== "undefined" &&
              aSwitch.white !== currentSwitch.white
            ) {
              aSwitch.white = currentSwitch.white;
              console.log(
                `Switch ${aSwitch.key} of device ${device.cname} white was set to ${aSwitch.white}`,
              );
            }
            if (
              typeof currentSwitch?.rgb !== "undefined" &&
              aSwitch.rgb.toString() !== currentSwitch.rgb.toString()
            ) {
              aSwitch.rgb = currentSwitch.rgb;
              console.log(
                `Switch ${aSwitch.key} of device ${device.cname} rgb was set to ${aSwitch.rgb}`,
              );
            }
          }
        }
      });
    }

    if (method === "NotifyFullStatus") {
      device.stable = params?.sys?.available_updates?.stable?.version;
      device.beta = params?.sys?.available_updates?.beta?.version;
    }
  }
}

module.exports = { update };
