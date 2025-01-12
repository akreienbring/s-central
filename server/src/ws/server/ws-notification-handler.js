/*
  Author: André Kreienbring
  Handles websocket messages related with notifications.
*/

const db = require("@db/db.js");

function handle(msg, ws) {
  if (msg.event === "notifications get all") {
    /*
      Frontend needs all notifications
    */
    const notificationsAnswer = {
      event: "notifications get all",
      data: {
        message: "OK! Here are all the notifications",
        requestID: msg.data.requestID,
      },
    };

    const sql = `SELECT * FROM notifications ORDER BY ts`;
    notificationsAnswer.data.notifications = db.get(sql);

    ws.send(JSON.stringify(notificationsAnswer));
  } else if (msg.event === "notification delete") {
    const deleteAnswer = {
      event: "notification delete",
      data: {
        message: "Notification deleted",
        success: true,
        requestID: msg.data.requestID,
      },
    };

    const info = db.del("notifications", ["id"], msg.data.ids);

    const sql = `SELECT * FROM notifications ORDER BY ts`;
    deleteAnswer.data.notifications = db.get(sql);
    ws.send(JSON.stringify(deleteAnswer));
  } else if (msg.event === "notification update") {
    // just update the isUnread field without sending an answer
    //
    let sIds = "";
    msg.data.ids.forEach((id) => {
      if (sIds !== "") sIds += ",";
      sIds += id;
    });
    sIds = `(${sIds})`;
    db.execute(`UPDATE notifications SET isUnread = 0 WHERE id IN ${sIds}`);
  }
}

module.exports = {
  handle,
};
