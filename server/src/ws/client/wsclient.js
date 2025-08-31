/*
  Author: André Kreienbring
  Used to send messages to the internal websocket server.
  */

const config = require("config");
const WebSocket = require("faye-websocket");

const ws = new WebSocket.Client(
  `ws://${config.get("ws-server.host")}:${config.get("ws-server.port")}`
);

const SECRET = config.get("ws-server.secret");

/**
  Sends a stringyfied message to the internal WS Server.
  On internal messages the secret is added to pass the server validation.
  The message will then be forwarded to the websocket server.
  @param {object} msg mandatory The message to forward.
*/
function send(msg) {
  if (typeof msg === "undefined") return;

  if (!msg.src) msg.data.secret = SECRET;
  ws.send(JSON.stringify(msg));
}

ws.on("open", function () {
  console.log("wsclient: opened connection to server");
});

ws.on("message", function (event) {
  console.log("wsclient: Received message", JSON.stringify(event.data));
});

ws.on("close", function (event) {
  console.log("wsclient: close", event.code, event.reason);
});

module.exports = { send };
