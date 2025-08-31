/*
  Author: André Kreienbring
  When a websocket client tries to initially upgrade a HTTP request (open a connection)
  or sends a message it could be a potential attack. 
  Therefor the message is validated before forwarding it to the ws-handler.
  This module also handles reconnection requests of the dashboard client.
*/

const config = require("config");
const db = require("@db/db.js");
const shellyDevices = require("@devices/shellyDevices.js");
const digest = require("@src/utils/digest.js");
const prettyjson = require("prettyjson");

const UNBLOCK_INTERVAL = config.get("ws-server.unblock-interval") * 1000;
const MESSAGELIMIT = config.get("ws-server.messagelimit");
const SECRET = config.get("ws-server.secret");

/*
  IPs that send wrong (or too many) messages will be blocked for the 
  configured amount of time.
*/
const blockedIPs = [];

/*
  When a client opens a connection his IP is added to this object.
  The entry is of the form { count: 0, startTime: Date.now() }
  Messages from the client will be counted. If the configured limit / minute
  is reached the client will be blocked.
*/
const clientLimits = {};

/*
  These events are not forced to send the secret.
  The secret is only send to clients that logged in 
  successfully with a 'user validate' ws event.
*/
const WITHOUT_SECRET = [
  "user reconnect",
  "user validate",
  "pong",
  "blogposts get public",
  "user resetpw",
];

/**
 * Validates messages send by a ws client. For user validation a 
 * digest authentication is implemented.
  @param {json} message The message that was send by a client.
    Message MUST contain event and data or src!
  @param {object} message The message that was send.
  @param {object} ws The websocket that was used to send the message.
  @returns {object} The validated message or NULL if the message is invalid
*/
function validateMessage(message, ws) {
  if (blockedIPs.includes(ws.clientIP)) {
    console.error(`${ws.clientIP} is currently blocked. Message not accepted`);
    ws.close(4013, "Client is blocked.");
    return null;
  }

  // Limit the the number of messages / minute a client can sent in the configured time
  if (!clientLimits[ws.clientIP]) {
    clientLimits[ws.clientIP] = {
      count: 0,
      startTime: Date.now(),
    };
  } else {
    const clientLimit = clientLimits[ws.clientIP];
    if (Date.now() - clientLimit.startTime < 60000) {
      clientLimit.count++;
      if (clientLimit.count > MESSAGELIMIT) {
        console.error(`${ws.clientIP} reached the message limit`);
        ws.close(4013, "Message limit reached");
        delete clientLimits[ws.clientIP];
        if (!blockedIPs.includes(ws.clientIP)) blockedIPs.push(ws.clientIP);
        return null;
      }
    } else {
      clientLimit.count = 1;
      clientLimit.startTime = Date.now();
    }
  }

  if (message === null || typeof message === "undefined") {
    console.error(`${ws.clientIP} send an undefined message`);
    if (!blockedIPs.includes(ws.clientIP)) blockedIPs.push(ws.clientIP);
    ws.close(4003, "Invalid message!");
    return null;
  }

  // now try to parse the message to check its properties
  let msg;
  try {
    msg = JSON.parse(message);
    if (!msg.src && (!msg.event || !msg.data)) {
      console.error(`${ws.clientIP} send an invalid message: ${message}`);
      if (!blockedIPs.includes(ws.clientIP)) blockedIPs.push(ws.clientIP);
      ws.close(4003, "Invalid message!");
      return null;
    }
  } catch (error) {
    console.error(`Could not parse ws message: ${message} from ${ws.clientIP}`);
    if (!blockedIPs.includes(ws.clientIP)) blockedIPs.push(ws.clientIP);
    ws.close(4003, "Invalid message!");
    return null;
  }

  if (msg.event === "user validate") {
    if (
      typeof msg.data.auth === "undefined" &&
      typeof msg.data.error === "undefined"
    ) {
      // if auth information is not attached: start the challenge / response cicle
      msg.data.error = digest.getChallengeError();
      ws.send(JSON.stringify(msg));
      return null;
    } else {
      // if auth information is  attached: check the response
      const dbUser = db.getUser(
        `SELECT HA1, alias FROM users WHERE email = ?`,
        msg.data.user.email
      );
      if (dbUser && digest.validate(dbUser, msg.data.auth)) {
        console.log(`Successfully validated user ${dbUser.alias}`);
        delete msg.data.auth;
        msg.data.secret = SECRET;
      } else {
        const validateAnswer = {
          event: "user validate",
          data: {
            success: false,
            message: "_wrongpw_",
            requestID: msg.data.requestID,
          },
        };
        ws.send(JSON.stringify(validateAnswer));
        console.error(`Got invalid credentials from: ${msg.data.user.email}`);
        return null;
      }
    }
  } else if (msg.event === "user reconnect") {
    if (msg.data.user !== null && db.isExistingUser(msg.data.user)) {
      console.log(`Successfully reconnected user ${msg.data.user.alias}`);
      msg.data.secret = SECRET;
    } else {
      console.error(
        `A client with IP '${
          ws.clientIP
        }' tried to reconnect with a non existing user ${JSON.stringify(
          msg.data.user
        )}`
      );
      // without the secret attached the user will be logged out
    }
  } else if (typeof msg.src !== "undefined") {
    // check if the device exists
    const device = shellyDevices.findDeviceById(msg.src);
    if (typeof device === "undefined") {
      console.error(`Message from a non existing device: ${msg.src}`);
      console.log(prettyjson.render(msg));

      if (!blockedIPs.includes(ws.clientIP)) blockedIPs.push(ws.clientIP);
      ws.close(4003, "Device doesn't exist");
      return null;
    }
  } else if (
    !WITHOUT_SECRET.includes(msg.event) &&
    !msg.src &&
    msg.data.secret !== SECRET
  ) {
    // all other messages need to have the secret attached.
    console.error(
      `Message from client ${ws.clientIP} with event: '${msg.event}' and Text ${msg.data.message} does not have the correct secret.`
    );
    console.error(`Wrong Secret is: ${msg.data.secret}`);
    if (!blockedIPs.includes(ws.clientIP)) blockedIPs.push(ws.clientIP);
    ws.close(4000, "Wrong secret!");
    return null;
  }

  /*
   If the message is valid, remove the secret an return it.
   It will be handled by the ws-handler.
   */
  // delete msg.data.secret;
  return msg;
}

/*
  This interval unblocks client ips that were added to the blocked list.
  This way blocked clients can not open / upgrade ws connections for 
  the configured period of time.
*/
if (UNBLOCK_INTERVAL > 0) {
  setInterval(() => {
    if (blockedIPs.length > 0) {
      console.log(`Unblocking IP ${blockedIPs[0]}`);
      blockedIPs.splice(0, 1);
    }
  }, UNBLOCK_INTERVAL);
}

module.exports = { validateMessage, blockedIPs, clientLimits };
