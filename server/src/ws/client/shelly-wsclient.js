/*
  Author: André Kreienbring
  To get the 'NotifyFullStatus' this module establishes a ws connection to the shelly with the given IP.
  This is done because the shellies send this status only one time after this server is started.
  The same can be achieved with GetStatus requests to the shellies directly.
  Concept: If there's no open ws connection to the shelly, a new one is created.
  When the connection is open a timestamp is added. 
  Send messages are buffered till the answer is received.
  If an answer is received, the timestamp of the wsclient is updated.
  If theres no anwswer received for a given time, the device is considered as offline.
*/
const WebSocket = require("faye-websocket");
const wsclient = require("@ws/client/wsclient");
const shellyAuth = require("@src/utils/shelly-auth.js");
// eslint-disable-next-line no-unused-vars
const prettyjson = require("prettyjson");

/*
  Predefined standard bodies with the RPC channel that will be used for the communication
  with the Gen2+ device. Number of RPC channels can range from 0-5 and can be used to identify
  the result of a request.
  'src' is a standard user existing on the shelly devices
  The body may be enhanced with properties during the process.
*/
const getStatusBody = { id: 1, src: "user_1", method: "Shelly.GetStatus" };
const sendCommandBody = { id: 2, src: "user_1" };

/*
  The shellyWSClients object contains all ws connections to the shelly devices.
  A client has the following structure: { ws: shellyws, password: device.password }
*/
const shellyWSClients = {};

/*
  Every message that must be send to a shelly device is buffered here.
  There are messages that must be resend if the auth info was added.
  Messages are identified by the device id and the RPC channel.
*/
const outstandingCommands = {};

/**
  Handles websocket messages received from a Shelly. If a device is protected,
  the digest authentication will be triggered.
  @param {object} event The message with data
*/
function onMessage(event) {
  let msg = JSON.parse(event.data);
  const shellyws = shellyWSClients[msg.src].ws;
  const password = shellyWSClients[msg.src].password;
  shellyWSClients[shellyws.id].ts = Math.floor(Date.now() / 1000);

  if (typeof msg.error !== "undefined") {
    if (msg.error.code === 401) {
      // Not authenticated. Add the credentials to the buffered body / payload
      // console.log("401. Not authorized");
      const command = outstandingCommands[msg.src];
      if (typeof command !== "undefined" && command.id === msg.id) {
        command.body.auth = shellyAuth.getWSCredentials(
          JSON.parse(msg.error.message),
          password,
        );

        // Retry with challenge response object
        shellyws.send(JSON.stringify(command.body));
        delete outstandingCommands[msg.src];
      } else {
        console.error(
          `Could not associate a digest challenge with src: ${msg.src} and id: ${msg.id}`,
        );
      }
    }
  } else if (typeof msg.result !== "undefined" && msg.id === 1) {
    /*
      This is the result of the GetStatus request. Identified by the 
      used communication id of 1.
      Mimic a 'NotifyFullStatus object for the client.
    */
    const notifyFullStatus = {
      src: msg.src,
      dst: "request",
      method: "NotifyFullStatus",
      params: msg.result,
    };
    notifyFullStatus.params.ts = Math.floor(Date.now()) / 1000;
    wsclient.send(notifyFullStatus);
    delete outstandingCommands[msg.src];
  } else if (typeof msg.method !== "undefined") {
    // ignore other messages as they will be handled by wsHandler.
  }
}

/**
  Creates a websocket client to the given device.
  All incoming messages are handled by the onMessage function.
  @param {object} device The device to connect to via websocket.
*/
function createWSClient(device) {
  if (device.gen > 1) {
    const shellyws = new WebSocket.Client(`ws://${device.ip}/rpc`);
    // add the id to identify the device websocket on an event.
    shellyws.id = device.id;
    shellyWSClients[device.id] = {
      ws: shellyws,
      password: device.password,
      cname: device.cname,
    };

    shellyws.on("open", (event) => {
      console.log(`Opened a ws connection to ${device.cname}`);
      shellyWSClients[shellyws.id].ts = Math.floor(Date.now() / 1000);
      const command = outstandingCommands[shellyws.id];
      if (typeof command !== "undefined") {
        console.log(
          `Sending outstanding command: ${JSON.stringify(command.body)} to ${
            device.cname
          }`,
        );
        shellyws.send(JSON.stringify(command.body));
      }
    });

    shellyws.on("message", onMessage);

    shellyws.on("close", (event) => {
      console.warn(
        `Websocket to Shelly ${
          shellyWSClients[shellyws.id].cname
        } was closed with code ${event.code}. Reason: ${event.reason}`,
      );
      delete shellyWSClients[shellyws.id];
    });

    shellyws.on("error", (event) => {
      console.error(`Websocket client error: ${event.data}`);
    });
  }
}

/**
  Checks if a socket to the given device is still open. If not, a new socket is created.
  @param {object} shellyWSClient the previous stored websocket client for a device
  @param {object} device The device to connect to
  @returns {boolean} true if the socket is open, false if a new socket was created
*/
function isOpenSocket(shellyWSClient, device) {
  /*
    A client is undefined if the websocket was never created or was closed
    A client.ws.readyState is 1 if the connection is open
  */
  if (
    typeof shellyWSClient === "undefined" ||
    shellyWSClient.ws.readyState !== 1
  ) {
    console.log(
      `There is no open websocket to ${device.cname}. Opening a new socket!`,
    );
    createWSClient(device);
    return false;
  } else {
    return checkDeviceOnline(shellyWSClient, device);
  }
}

/**
  Using a websocket client, that is connected to the inbound websocket server on a Shelly,  
  the status is requested, converted to the form of a 'NotifyFullStatus' and then finally send
  (with a websocket client) to the 'wsHandler' websocket server, that forwards it to his clients.
  @param {object} device mandatory The device that represents the shelly to get the status from
*/
function sendNotifyFullStatus(device) {
  const shellyWSClient = shellyWSClients[device.id];

  const body = { ...getStatusBody };

  outstandingCommands[device.id] = {
    id: body.id,
    body: body,
  };

  if (isOpenSocket(shellyWSClient, device))
    shellyWSClient.ws.send(JSON.stringify(body));
}

/**
  Sends the given RPC command WITHOUT waiting for an answer.
  This means that there's no handler in the 'onMessage' function.
  @async
  @param {object} device The device the command will be send to.
  @param {string} method The RPC method to send
  @param {object} params Paramters for the RPC command.
*/
function sendCommand(device, method, params) {
  const shellyWSClient = shellyWSClients[device.id];

  const body = { ...sendCommandBody };
  body.method = method;
  body.params = params;
  outstandingCommands[device.id] = { id: body.id, body };

  if (isOpenSocket(shellyWSClient, device))
    shellyWSClient.ws.send(JSON.stringify(body));
}
/**
 * Checks the timestamp of the open event or the last received message from the shelly device.
 * If the timestamp is older than 3 minutes the device is considered as offline else as online
 * In both cases, if the online status changed, a device-update message is send to notify clients.
 * @param {object} shellyWSClient  The ws client of the shelly device
 * @param {object} device The device to set online/offline
 * @returns {boolean} true if the device is online, false if it's offline
 */
function checkDeviceOnline(shellyWSClient, device) {
  if (
    Math.floor(Date.now() / 1000) - shellyWSClient.ts >
    180
    // || Math.random() < 0.1 // uncomment Math.random() line to simulate offline devices for testing
  ) {
    // consider the device offline after 3 minutes without response
    if (device.online) {
      console.log(
        `No response from device ${shellyWSClient.cname} for more than 3 minutes. Considering it as offline.`,
      );
      device.online = false;
      let message = {
        event: "device-update",
        type: "device",
        source: "ShellyWSClient",
        message: `Device status changed to ${
          device.online ? "ONLINE" : "OFFLINE"
        }`,
        data: {
          device,
        },
      };
      wsclient.send(message);

      message = {
        event: "notification-create",
        source: "ShellyWSClient",
        message: `${device.cname} is offline`,
        data: {
          notification: {
            type: "device-offline",
            device_ip: device.ip,
            device_cname: device.cname,
            notification: `${device.cname} is offline`,
          },
        },
      };
      wsclient.send(message);
    }
    return false;
  } else {
    if (!device.online) {
      console.log(`Device ${shellyWSClient.cname} is back online.`);
      device.online = true;
      let message = {
        event: "device-update",
        eventType: "device",
        source: "ShellyWSClient",
        message: `Device status changed to ${
          device.online ? "ONLINE" : "OFFLINE"
        }`,
        data: {
          device,
        },
      };
      wsclient.send(message);
    }
    return true;
  }
}

module.exports = {
  sendNotifyFullStatus,
  sendCommand,
};
