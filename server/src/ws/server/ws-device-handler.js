/*
  Author: André Kreienbring
  Handles websocket messages related with devices.
*/
const shellyGen2Conn = require("@http/shellyGen2Conn.js");
const db = require("@db/db.js");

function handle(msg, ws) {
  if (msg.event === "devices get all") {
    /*
      A dashboard client needs the list of devices.
    */
    shellyGen2Conn.getDevices().then((devices) => {
      const answer = {
        event: "devices get all",
        data: {
          message: "OK! Here are all the devices!",
          devices: devices,
          requestID: msg.data.requestID,
        },
      };
      ws.send(JSON.stringify(answer));
    });
  } else if (msg.event === "devices timeline get") {
    /*
      A dashboard client needs the list of devices.
      And the initial timeline by minutes
    */
    shellyGen2Conn.getDevices().then((devices) => {
      const answer = {
        event: "devices timeline get",
        data: {
          message: "OK! Here are all the devices and the timeline!",
          devices: devices,
          requestID: msg.data.requestID,
        },
      };
      answer.data.rows = db.select("cByMinute", [], [], [], null, "ts");
      ws.send(JSON.stringify(answer));
    });
  }
}

module.exports = {
  handle,
};
