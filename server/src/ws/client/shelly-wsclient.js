/*
  Author: André Kreienbring
  To get the 'NotifyFullStatus' this module establishes a ws connection to the shelly with the given IP.
  This is done because the shellies send this status only one time after this server is started.
  The same can be achieved with GetStatus requests to the shellies directly.
*/
const WebSocket = require("faye-websocket");
const wsclient = require("@ws/client/wsclient");
const shellyAuth = require("@src/utils/shelly-auth.js");
const prettyjson = require("prettyjson");
const c = require("config");

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

  if (typeof msg.error !== "undefined") {
    if (msg.error.code === 401) {
      // Not authenticated. Add the credentials to the buffered body / payload
      // console.log("401. Not authorized");
      const command = outstandingCommands[msg.src];
      if (typeof command !== "undefined" && command.id === msg.id) {
        command.body.auth = shellyAuth.getWSCredentials(
          JSON.parse(msg.error.message),
          password
        );

        // Retry with challenge response object
        shellyws.send(JSON.stringify(command.body));
        delete outstandingCommands[msg.src];
      } else {
        console.error(
          `Could not associate a digest challenge with src: ${msg.src} and id: ${msg.id}`
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
    const date = new Date();
    notifyFullStatus.params.ts = Math.floor(date.getTime() / 1000);
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
      console.log(`Opened a ws connection to Shelly ${device.cname} `);
    });

    shellyws.on("message", onMessage);

    shellyws.on("close", (event) => {
      console.warn(
        `Websocket to Shelly ${
          shellyWSClients[shellyws.id].cname
        } was closed with code ${event.code}. Reason: ${event.reason}`
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
  @param {object} shellyws the previous stored websocket client for a device
  @param {object} device The device to connect to
  @returns {boolean} true if the socket is open, false if a new socket was created
*/
function isOpenSocket(client, device) {
  /*
    A client is undefined if the websocket was never created
    A client is null if the websocket was closed
    A client.ws.readyState is 1 if the connection is open
  */
  if (typeof client === "undefined") {
    console.log(
      `There is no open websocket to ${device.cname}. Opening a new socket!`
    );
    createWSClient(device);
    return false;
  }
  return true;
}

/**
  Using a websocket client, that is connected to the inbound websocket server on a Shelly,  
  the status is requested, converted to the form of a 'NotifyFullStatus' and then finally send
  (with a websocket client) to the 'wsHandler' websocket server, that forwards it to his clients.
  @param {object} device mandatory The device that represents the shelly to get the status from
*/
function sendNotifyFullStatus(device) {
  let client = shellyWSClients[device.id];
  if (!isOpenSocket(client, device)) return;

  client.ws.send(JSON.stringify(getStatusBody));
  outstandingCommands[device.id] = {
    id: getStatusBody.id,
    body: getStatusBody,
  };
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
  let client = shellyWSClients[device.id];
  if (!isOpenSocket(client, device)) return;

  const body = { ...sendCommandBody };
  body.method = method;
  body.params = params;

  client.ws.send(JSON.stringify(body));
  outstandingCommands[device.id] = { id: body.id, body };

  /*  
if (!client.ws.send(JSON.stringify(body))) {
    client = null;
  } else {
    outstandingCommands[device.id] = { id: body.id, body };
  }
}
  */
}
module.exports = {
  sendNotifyFullStatus,
  sendCommand,
};
