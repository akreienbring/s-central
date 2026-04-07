/*
  Author: André Kreienbring
  A websocket server that handles all websocket activity. 
  Websocket clients can be the Shelly device outbound websocket, 
  the Dashboard application powered by React or the internal wsclient.

  If dashboard ws client ads a channelID to the message data, the 
  websocket connection is stored in an internal object
  that is used for subsequent communication with the client.

  The Shelly outbound websocket sends information that is used to
  update the device in memory and than forwarded to the Dashboard application.
*/
const prettyjson = require("prettyjson");
const config = require("config");
const shellyDevices = require("@devices/shellyDevices.js");
const shellyConnector = require("@devices/shellyConnector.js");

const updateDeviceValues = require("@src/utils/update-device-values.js");
const updateConsumption = require("@src/utils/update-consumption.js");
const reloadCheck = require("@src/utils/reloadcheck.js");
const wsUserHandler = require("./ws-user-handler.js");
const wsRoleHandler = require("./ws-role-handler.js");
const wsDeviceHandler = require("./ws-device-handler.js");
const wsNotificationHandler = require("./ws-notification-handler.js");
const wsBlogpostHandler = require("./ws-blogpost-handler.js");
const wsTimelineHandler = require("./ws-timeline-handler.js");
const wsSceneHandler = require("./ws-scene-handler.js");

/*
  An interval that pings the clients. If a client not responds it will be deleted
  from the internal list of ws clients
*/
const HEARTBEAT_INTERVAL = config.get("ws-server.ping-interval") * 1000; // ping interval in seconds
const HEARTBEAT_VALUE = 1;
const PING_MESSAGE = {
  event: "ping",
  message: HEARTBEAT_VALUE,
  source: "WSHandler",
  data: {},
};

/* 
  When connected, the dashboard client sends a (reconnect) message. The websocket is then stored
  and managed with this object. The channelID property is used as the key
  in this object. The value is the websocket the client uses.
*/
const dashboardClients = {};

/**
  Add a websocket to the internal list.
  The property name is the unique client name, the client has generated.
  The name either starts with the shelly device ID or with "View" followed
  by a random number.
  The ws is also considered as being alive.
  @param {object} ws The websocket to store. Must have an unique 'channelID' property
    to identify it.
*/
function addSocket(ws) {
  ws.isAlive = true;

  dashboardClients[ws.channelID] = ws;
  console.log(
    `wshandler: added socket ${ws.channelID}. Got ${
      Object.keys(dashboardClients).length
    } websockets`,
  );
}

/**
  Delete a websocket from the internal list.
  The websocket is identified by the ID of the channel, that the client
  sends with his first message.
  If the channelID is undefined, the ws client doesn't require a permanent connection.
  @param {object} ws The websocket to delete. Must have an unique 'channelID' property
    to identify it.
*/
function deleteSocket(ws) {
  if (
    typeof ws.channelID !== "undefined" &&
    typeof dashboardClients[ws.channelID] !== "undefined"
  ) {
    delete dashboardClients[ws.channelID];
    console.log(
      `wshandler: deleted socket ${ws.channelID}. Got ${
        Object.keys(dashboardClients).length
      } websockets`,
    );
  }
}

/**
  Receives messages from Shelly outbound websocket, the Dashboard application
  or the internal wsclient. The message was sent over the given websocket.
  Depending on the message properties actions are taken and answers are send.
  If a channelID exists, store the channel for later communication or deletion.
  The clients should respond with a pong to a ping to keep the websocket open.
  @param {object} msg The message that was send by a client.
  @param {object} ws The websocket that was used to send the message.
*/
function handleMessage(msg, ws) {
  //------------- Message Handling---------------------------
  if (typeof msg.src === "undefined") {
    if (typeof msg.channelID !== "undefined") {
      ws.channelID = msg.channelID;
      addSocket(ws);
    }
  }

  if (typeof msg.src !== "undefined") {
    /*
      Websocket message from a Shelly device.
      The device is identified by its Shelly ID, retrived from the internal list and 
      enriched with the websocket message from the Shelly.
      The updated device is forwarded to the Dashboard application
    */
    let device = shellyDevices.findDeviceById(msg.src);
    if (typeof device !== "undefined") {
      if (msg.method === "NotifyFullStatus" && msg.dst === "request") {
        updateConsumption.update(device, msg.params);
        delete device.rebootPending;
      }

      // Do the reload check with all messages because depending on the result a device-update is sent or not
      reloadCheck.check(device, msg).then((reloadedDevice) => {
        if (reloadedDevice !== null) {
          device = reloadedDevice;
          console.log(`Device ${device.cname} was reloaded`);

          const reloadMessage = {
            event: "device-update",
            eventType: "device",
            source: "WSHandler",
            message: "Device was reloaded",
            subscriptionID: msg.src,
            data: {
              device,
            },
          };
          broadcast(reloadMessage);

          // don't send any further message to the client, if a device was reloaded
          return;
        }

        if (
          ((msg.dst === "ws" && msg.method !== "NotifyFullStatus") ||
            (msg.dst === "request" && msg.method === "NotifyFullStatus")) &&
          typeof msg.params !== "undefined"
        ) {
          /*
            Only forward requested NotifyFullStatus or
            other messages (NotifyStatus, NotifyEvent...) directly send by the device,
          */
          updateDeviceValues.update(device, msg);
          device[
            `${msg.method.charAt(0).toLowerCase()}${msg.method.slice(1)}`
          ] = msg;

          const updateMessage = {
            event: "device-update",
            eventType: "ws",
            source: "WSHandler",
            message: "new WS message",
            subscriptionID: msg.src,
            data: {
              device: device,
            },
          };
          broadcast(updateMessage);
        }
      }); // reloadCheck
    } else {
      console.error(`wshandler: Couldn't find device with id ${msg.src}`);
    }
  } else if (typeof msg.event !== "undefined") {
    // message from dashboard client, endpoint or loghandler
    if (msg.event === "user-reconnect") {
      // Send after a client tried to reconnect.
      msg.message =
        typeof msg.secret !== "undefined"
          ? "OK, will reconnect you!"
          : "Couldn't reconnect you";
      ws.send(JSON.stringify(msg));
    } else if (msg.event === "device-update") {
      // message from Loghandler or enpoint is simply forwarded to all clients
      msg.subscriptionID = msg.data.device.id;
      broadcast(msg);
    } else if (msg.event === "pong" && msg.message === HEARTBEAT_VALUE) {
      // the client answered to a ping message
      ws.isAlive = true;
    } else if (msg.event.startsWith("timeline-get")) {
      const timelineAnswer = wsTimelineHandler.handle(msg);
      if (timelineAnswer !== null) ws.send(JSON.stringify(timelineAnswer));
    } else if (msg.event === "toggle-switch") {
      const aSwitch = msg.data.switch;
      const device = shellyDevices.findDeviceById(aSwitch.deviceId);
      device.switches[aSwitch.id] = aSwitch;
      shellyConnector.toggleSwitch(device, aSwitch);
    } else if (msg.event === "set-switch") {
      const aSwitch = msg.data.switch;
      const device = shellyDevices.findDeviceById(aSwitch.deviceId);
      device.switches[aSwitch.id] = aSwitch;
      shellyConnector.setSwitch(device, aSwitch);
    } else if (msg.event === "toggle-script") {
      const script = msg.data.script;
      const device = shellyDevices.findDeviceById(msg.data.deviceId);
      device.scripts[msg.data.script.id] = script;
      shellyConnector.toggleScript(device, script);
    } else if (msg.event.startsWith("user")) {
      wsUserHandler.handle(msg, ws);
    } else if (msg.event.startsWith("role")) {
      const roleAnswer = wsRoleHandler.handle(msg);
      if (roleAnswer !== null) ws.send(JSON.stringify(roleAnswer));
    } else if (msg.event.startsWith("scene")) {
      wsSceneHandler.handle(msg, ws);
    } else if (msg.event.startsWith("device")) {
      wsDeviceHandler.handle(msg, ws);
    } else if (msg.event.startsWith("notification")) {
      // handle notifications created by the server
      const notificationAnswer = wsNotificationHandler.handle(msg);
      if (notificationAnswer !== null) {
        broadcast(notificationAnswer);
      }
    } else if (msg.event.startsWith("blog")) {
      const blogAnswer = wsBlogpostHandler.handle(msg);
      if (blogAnswer !== null) ws.send(JSON.stringify(blogAnswer));
    } else {
      console.log(
        "wshandler: received unhandled message (event unknown): " +
          prettyjson.render(msg),
      );
    }
  } else {
    // Unidentified message will just be logged to the console
    console.log(
      "wshandler: received unhandled message (no event, no src): " +
        prettyjson.render(msg),
    );
  }
}

/**
  Called when the connection to a client was opened. 
  The socket will be stored in the internal list, when the first message is received.
  @param {object} ws The websocket connection
*/
function handleOpen(ws) {
  // console.log("wshandler: Connection was opened");
}

/**
  Called when the connection to a client was closed.
  Sets the maintained websocket connection to null
  @param {object} event has information over the connection
  @param {object} ws The websocket connection
*/
function handleClose(event, ws) {
  console.log(
    `wshandler: Connection was closed. Code: ${event.code} Reason: ${event.reason}`,
  );
  // remove the socket from the internal list
  deleteSocket(ws);
}

/**
  Send a message to all connected clients.
  As there may be more than one frontend running in the local network.
  @param {object} message The message that will be send to all managed clients.
*/
function broadcast(message) {
  // eslint-disable-next-line no-unused-vars
  Object.entries(dashboardClients).forEach(([channelID, ws]) => {
    if (typeof ws !== "undefined" && ws !== null) {
      //console.log(`Broadcasting to channelID ${channelID}`);
      ws.send(JSON.stringify(message));
    }
  });
}

/*
  This interval sends a ping to all clients. The client is set to inactive and
  will reactivated when message with a pong arrives.
  If a ws client doesn't respond within the configured time, the websocket is deleted.
*/
if (HEARTBEAT_INTERVAL > 0) {
  console.log(`Sending ping to all managed clients`);
  setInterval(() => {
    // eslint-disable-next-line no-unused-vars
    Object.entries(dashboardClients).forEach(([channelID, ws]) => {
      if (typeof ws !== "undefined" && ws !== null) {
        if (!ws.isAlive) {
          ws.close(1000, "Did not receive a pong!");
          deleteSocket(ws);
        }

        ws.isAlive = false;
        // console.log(`Sending PING to ${channelID}`);
        ws.send(JSON.stringify(PING_MESSAGE));
      }
    });
  }, HEARTBEAT_INTERVAL);
}

module.exports = { handleMessage, handleClose, handleOpen };
