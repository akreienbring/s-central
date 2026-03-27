/*
  Author: André Kreienbring
  Handles websocket messages related with role management.
*/
const db = require("@db/db.js");

/** 
  Handles messages sent by the frontend that are related to role managment.
  @param {object} msg The message that was sent by the frontend.
  @returns {object} The (answer) message that will be send to the client
*/
function handle(msg) {
  if (msg.event === "roles-get-all") {
    // client needs the list of all roles
    const rolesAnswer = {
      event: msg.event,
      message: "OK! Here are all the roles",
      source: "WSRoleHandler",
      requestID: msg.requestID,
      data: {},
    };

    const sql = `SELECT * FROM roles ORDER BY name`;
    rolesAnswer.data.roles = db.get(sql);
    return rolesAnswer;
  }
}

module.exports = {
  handle,
};
