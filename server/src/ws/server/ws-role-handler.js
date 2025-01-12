/*
  Author: André Kreienbring
  Handles websocket messages related with role management.
*/
const db = require("@db/db.js");

function handle(msg, ws) {
  if (msg.event === "roles get all") {
    // client needs the list of all roles
    const rolesAnswer = {
      event: "roles get all",
      data: {
        message: "OK! Here are all the roles",
        requestID: msg.data.requestID,
      },
    };

    const sql = `SELECT * FROM roles ORDER BY name`;
    rolesAnswer.data.roles = db.get(sql);
    ws.send(JSON.stringify(rolesAnswer));
  }
}

module.exports = {
  handle,
};
