/*
  Author: André Kreienbring
  A websocket server that handles all websocket activity. 
  Websocket clients can be the Shelly device outbound websocket
  or the Dashboard application powered by React.

  If the ws client ads a channel to the message data, the 
  websocket connection is stored in an internal object
  that is used for subsequent communication with the client.

  The Shelly outbound websocket sends information that is used to
  update the device in memory and than forwarded to the Dashboard application.
*/
const prettyjson = require("prettyjson");
const config = require("config");
const shellyGen2Conn = require("@http/shellyGen2Conn.js");
const updateDeviceValues = require("@src/utils/update-device-values.js");
const db = require("@db/db.js");
const wsUserHandler = require("./ws-user-handler.js");
const wsRoleHandler = require("./ws-role-handler.js");
const wsDeviceHandler = require("./ws-device-handler.js");
const wsNotificationHandler = require("./ws-notification-handler.js");
const wsBlogpostHandler = require("./ws-blogpost-handler.js");

/*
  An interval that pings the clients. If a client not responds it will be deleted
  from the internal list of ws clients
*/
const HEARTBEAT_INTERVAL = config.get("ws-server.ping-interval") * 1000; // ping interval in seconds
const HEARTBEAT_VALUE = 1;
const PING_MESSAGE = {
  event: "ping",
  data: {
    message: HEARTBEAT_VALUE,
  },
};

/* 
  When connected, a client sends a message. The websocket is then stored
  and managed with this object. The channel property is used as the key
  in this object. The value is the websocket the client uses.
*/
const dashboardClients = {};

db.open();

/*
  Add a websocket to the internal list.
  The property name is the unique client name, the client has generated.
  The name either starts with the shelly device ID or with "View" followed
  by a random number.
  The ws is also considered as being alive.
  When the first socket is stored, the database is opened.
  @param {object} ws The websocket to store. Must have an unique 'channelID' property
    to identify it.
*/
function addSocket(ws) {
  ws.isAlive = true;

  dashboardClients[ws.channelID] = ws;
  console.log(
    `wshandler: added socket ${ws.channelID}. Got ${
      Object.keys(dashboardClients).length
    } websockets`
  );
}

/*
  Delete a websocket from the internal list.
  The websocket is identified by the ID of the channel, that the client
  sends with his first message.
  If the channelID is undefined, the ws client doesn't require a permanent connection.
  The name/ID either starts with:
    - the shelly device ID (if it handles a single device)
    - "view" followed by a random number if it handles the list of devices
    - "user" followed by a random number if it handles users
  @param {object} ws The websocket to store. Must have an unique 'channelID' property
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
      } websockets`
    );
  }
}

/*
  Receives messages from Shelly outbound websocket or
  the Dashboard application. The message was sent over the given websocket.
  Depending on the message properties actions are taken and answers are send.
  If a channelID exists, store the channel for later communication or deletion.
  The clients should respond with a pong to a ping to keep the websocket open.
  @param {object} msg The message that was send by a client.
  @param {object} ws The websocket that was used to send the message.
*/
function handleMessage(msg, ws) {
  //------------- Message Handling---------------------------
  if (typeof msg.src === "undefined") {
    /*
    console.log(
      `wshandler: ${msg.data.source} says: '${msg.data.message}' in channel ${msg.data.channel}`
    );
    */
    if (typeof msg.data.channel !== "undefined") {
      ws.channelID = msg.data.channel;
      addSocket(ws);
    }
  } else {
    // console.log(`wshandler: New ws message from ${msg.src}`);
  }

  if (typeof msg.src !== "undefined") {
    /*
      Websocket message from a Shelly device.
      The device is identified by its Shelly ID, retrived from the internal list and 
      enriched with the websocket message from the Shelly.
      The updated device is forwarded to the Dashboard application
    */

    let device = shellyGen2Conn.findDeviceById(msg.src);
    if (typeof device !== "undefined") {
      if (!device.online || device.name === "unknown") {
        // reload the device because it's obviously online
        console.warn(`Reloading device ${device.cname}`);

        shellyGen2Conn.getDevice(device.ip, true).then((reloadedDevice) => {
          device = reloadedDevice;
          const reloadMessage = {
            event: "ShellyUpdate",
            type: "device",
            data: {
              source: "WSHandler",
              message: "Device was reloaded",
              device: device,
              subscriptionID: msg.src,
            },
          };
          broadcast(reloadMessage);
        });
      }

      /* 
        Update the db with consumption data and get the current
        state of the switches ONLY if the NotifyFullStatus was
        requested from the device.
      */
      if (
        msg.method === "NotifyFullStatus" &&
        msg.dst === "request" &&
        typeof msg.params !== "undefined"
      ) {
        updateDeviceValues.update(device, msg.params);
      }

      /*
        ONLY initialize wsmessages if it doesn't exist and
        add only the current websocket message to the device.
      */
      if (typeof device.wsmessages === "undefined") device.wsmessages = {};
      device.wsmessages[msg.method] = msg;

      const updateMessage = {
        event: "ShellyUpdate",
        type: "ws",
        data: {
          source: "WSHandler",
          message: "new WS message",
          device: device,
          subscriptionID: msg.src,
        },
      };
      broadcast(updateMessage);
    } else {
      console.error(`wshandler: Couldn't find device with id ${msg.src}`);
    }
  } else if (typeof msg.event != "undefined") {
    if (msg.event === "user reconnect") {
      // Send after a client reopened a connection.
      msg.data.message = "OK, will reconnect you!";
      ws.send(JSON.stringify(msg));
    } else if (msg.event === "ShellyUpdate") {
      // message from Loghander or enpoint is simply forwarded to all clients
      msg.data.subscriptionID = msg.data.device.id;
      broadcast(msg);
    } else if (msg.event === "ScriptError") {
      /* 
      Loghandler has detected a Script error.
      Create a notification in the DB and broadcast to all clients
    */
      let notification = msg.data.notification;

      const script = shellyGen2Conn.findScript(
        notification.device_ip,
        notification.script_id
      );

      if (typeof script !== "undefined") {
        // add the name of the script. The frontend will create a link!
        notification = {
          type: notification.type,
          device_ip: notification.device_ip,
          device_cname: notification.device_cname,
          script_id: notification.script_id,
          script_name: script.name,
          notification: notification.notification,
          isUnread: 1,
          ts: Date.now(),
        };

        info = db.insert("notifications", notification, true);

        // use the row id to identify the notification when it's been deleted
        notification.id = info.lastInsertRowid;
        msg.data.notification = notification;
        broadcast(msg);
      } else {
        console.error(
          `Couldn't store a notification. Script with id ${notification.scrip_id} on device ${notification.device_cname} does not exist!`
        );
      }
    } else if (msg.event === "pong" && msg.data.message === HEARTBEAT_VALUE) {
      // the client answered to a ping message
      ws.isAlive = true;
    } else if (msg.event.startsWith("getTimeline")) {
      /*
        If the Dashboard receives a websocket message from a Shelly device 
        (eg. NotifyStatus) it will ask for timeline data to print a chart.
        This data is fetched from the database and sent to the client.
      */
      const answer = {
        event: "timeline",
        data: {
          source: "WSHander",
          message: `OK! ${msg.event}`,
          requestID: msg.data.requestID,
        },
      };
      if (msg.event === "getTimelineMinute") {
        answer.data.rows = db.select("cByMinute", [], [], [], null, "ts");
      } else if (msg.event === "getTimelineHour") {
        answer.data.rows = db.select("cByHour", [], [], [], null, "ts");
      } else if (msg.event === "getTimelineDay") {
        answer.data.rows = db.select("cByDay", [], [], [], null, "ts");
      } else if (msg.event === "getTimelineMonth") {
        answer.data.rows = db.select("cByMonth", [], [], [], null, "ts");
      } else if (msg.event === "getTimelineYear") {
        answer.data.rows = db.select("cByYear", [], [], [], null, "ts");
      }
      if (typeof answer.data.rows !== "undefined") {
        ws.send(JSON.stringify(answer));
      }
    } else if (msg.event === "toggleSwitch") {
      shellyGen2Conn.toggleSwitch(msg.data.switch);
    } else if (msg.event === "setSwitch") {
      shellyGen2Conn.setSwitch(msg.data.switch);
    } else if (msg.event.startsWith("user")) {
      wsUserHandler.handle(msg, ws);
    } else if (msg.event.startsWith("role")) {
      wsRoleHandler.handle(msg, ws);
    } else if (msg.event.startsWith("device")) {
      wsDeviceHandler.handle(msg, ws);
    } else if (msg.event.startsWith("notification")) {
      wsNotificationHandler.handle(msg, ws);
    } else if (msg.event.startsWith("blog")) {
      wsBlogpostHandler.handle(msg, ws);
    } else {
      console.log(
        "wshandler: received unhandled message (event unknown): " +
          prettyjson.render(msg)
      );
    }
  } else {
    // Unidentified message will just be logged to the console
    console.log(
      "wshandler: received unhandled message (no event, no src): " +
        prettyjson.render(msg)
    );
  }
}

/*
  Called when the connection to a client was opened. 
  The socket will be stored in the internal list, when the first message is received.
  @param {object} ws The websocket connection
*/
function handleOpen(ws) {
  // console.log("wshandler: Connection was opened");
}

/*
  Called when the connection to a client was closed.
  Sets the maintained websocket connection to null
  @param {object} event has information over the connection
  @param {object} ws The websocket connection
*/
function handleClose(event, ws) {
  console.log(
    `wshandler: Connection was closed. Code: ${event.code} Reason: ${event.reason}`
  );
  // remove the socket from the internal list
  deleteSocket(ws);
}

/*
  Send a message to all connected clients.
  As there may be more than one Frontend running in the local network.
  @param {object} message The message that will be send to all managed clients.
*/
function broadcast(message) {
  // eslint-disable-next-line no-unused-vars
  Object.entries(dashboardClients).forEach(([channel, ws]) => {
    if (typeof ws !== "undefined" && ws !== null) {
      //console.log(`Broadcasting to channel ${channel}`);
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
