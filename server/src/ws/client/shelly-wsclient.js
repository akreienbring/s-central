/*
  Author: André Kreienbring
  To get the 'NotifyFullStatus' this module establishes a ws connection to the shelly with the given IP.
  This is done because the shellies send this status only one time after this server is started.
  The same can be achieved with GetStatus requests to the shellies directly.
*/
const WebSocket = require("faye-websocket");
const wsclient = require("@ws/client/wsclient");
const shellyAuth = require("@src/utils/shelly-auth.js");
const shellyGen1Conn = require("@http/shellyGen1Conn.js");
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

const shellyWSClients = {};

/*
  Buffers commands that must be resend if the auth info was added.
  Commands are identified by the device id and the RPC channel.
*/
const outstandingCommands = {};

/*
  Handles websocket messages received from a Shelly. If a device is protected,
  the digest authentication will be triggered.
  @param {object} event The message with data
*/
function onMessage(event) {
  let msg = JSON.parse(event.data);
  // console.log(prettyjson.render(msg));
  const shellyws = shellyWSClients[msg.src].ws;
  const password = shellyWSClients[msg.src].password;

  // console.log(prettyjson.render(event.data));
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
  } else if (typeof msg.method !== "undefined") {
    // ignore other messages as they will be handled by wsHandler.
  }
}

/*
  Creates a websocket client to the given device.
  All incoming messages are handled by the onMessage function.
  @param {object} device The device to connect to via websocket.
*/
function createWSClient(device) {
  if (device.gen > 1) {
    const shellyws = new WebSocket.Client(`ws://${device.ip}/rpc`);
    // add the id to identify the device on an event.
    shellyws.id = device.id;
    shellyWSClients[device.id] = { ws: shellyws, password: device.password };

    shellyws.on("open", (event) => {
      console.log(`Opened a ws connection to Shelly ${device.cname} `);
    });

    shellyws.on("message", onMessage);

    shellyws.on("close", (event) => {
      console.warn(
        `Websocket to Shelly ${shellyws.id} was closed with code ${event.code}. Reason: ${event.reason}`
      );
      shellyWSClients[shellyws.id] = null;
    });

    shellyws.on("error", (event) => {
      console.error(`Websocket client error: ${event.data}`);
    });
  }
}

/*
  Check if a socket to the given device is still open. If not, a new socket is creaetd.
  @param {object} shellyws the previous stored websocket client for a device
  @param {object} device The device to connect to
*/
function isOpenSocket(client, device) {
  if (client === null || typeof client === "undefined") {
    console.warn(
      `There is no websocket to ${device.cname}. Client is ${client}. Opening a new socket!`
    );
    createWSClient(device);
    return false;
  }
  return true;
}

/*
  Using a websocket client, that is connected to the inbound websocket server on a Shelly,  
  the status is requested, converted to the form of a 'NotifyFullStatus' and then finally send
  (with a websocket client) to the 'wsHandler' websocket server, that forwards it to his clients.
  @param: {object} device mandatory The device that represents the shelly to get the status from
*/
function sendNotifyFullStatus(device) {
  let client = shellyWSClients[device.id];
  if (!isOpenSocket(client, device)) return;

  if (!client.ws.send(JSON.stringify(getStatusBody))) {
    client = null;
  } else {
    outstandingCommands[device.id] = {
      id: getStatusBody.id,
      body: getStatusBody,
    };
  }
}

/*
  Sends the given RPC command WITHOUT waiting for an answer.
  This means that there's no handler in the 'onMessage' function.
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

  if (!client.ws.send(JSON.stringify(body))) {
    client = null;
  } else {
    outstandingCommands[device.id] = { id: body.id, body };
  }
}

/*
  Get a 'NotifyFullStatus' object from the Shelly Gen1 connector and 
  send it to the 'wsHandler' that forwards it to his clients.
  param {object} device A Gen1 device that is asked for its status.
*/
async function sendGen1Status(device) {
  const gen1Status = await shellyGen1Conn.getNotifyFullStatus(device);
  // console.log(JSON.stringify(gen1Status));
  wsclient.send(gen1Status);
}

module.exports = {
  sendNotifyFullStatus,
  sendCommand,
  sendGen1Status,
};
