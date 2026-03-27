/*
  Author: André Kreienbring
  Handles websocket messages related with notifications.
*/

const db = require("@db/db.js");
const shellyDevices = require("@devices/shellyDevices.js");

/** 
  Handles messages sent by the frontend that are related to notification managment.
  @param {object} msg The message that was sent by the frontend.
  @returns {object} The (answer) message that will be send to the client
*/
function handle(msg) {
  if (msg.event === "notifications-get-all") {
    /*
      Frontend needs all notifications
    */
    const notificationsAnswer = {
      event: msg.event,
      message: "OK! Here are all the notifications",
      source: "WSNotificationHandler",
      requestID: msg.requestID,
      data: {},
    };

    const sql = `SELECT * FROM notifications ORDER BY ts`;
    notificationsAnswer.data.notifications = db.get(sql);

    return notificationsAnswer;
  } else if (msg.event === "notification-create") {
    let notification = msg.data.notification;
    let notificationId;

    if (notification.type === "script-error") {
      /* 
        Loghandler has detected a Script error.
      */
      const script = shellyDevices.findScript(
        notification.device_ip,
        notification.script_id,
      );

      if (typeof script !== "undefined") {
        // update the script status in the device array
        script.running = false;

        notification = {
          type: notification.type,
          title: `Error: ${notification.device_cname}, Script: ${script.name}`,
          device_ip: notification.device_ip,
          device_cname: notification.device_cname,
          script_id: notification.script_id,
          script_name: script.name,
          notification: notification.notification,
          isUnread: 1,
          ts: Date.now(),
        };

        const info = db.insert("notifications", notification, true);

        notificationId = info.lastInsertRowid;
      } else {
        console.error(
          `Couldn't store a notification. Script with id ${notification.scrip_id} on device ${notification.device_cname} does not exist!`,
        );
        return null;
      }
    } else if (notification.type === "device-offline") {
      // endpoint was called
      notification = {
        type: notification.type,
        title: `Info: ${notification.device_cname} is offline`,
        device_ip: notification.device_ip,
        device_cname: notification.device_cname,
        script_id: null,
        script_name: null,
        notification: notification.notification,
        isUnread: 1,
        ts: Date.now(),
      };

      const info = db.insert("notifications", notification, true);

      notificationId = info.lastInsertRowid;
    } else {
      console.error(
        `Couldn't store a notification. Notification Type ${notification.type} is unknown!`,
      );
      return null;
    }

    notification.id = notificationId;
    notification.isUnread = true;
    msg.data.notification = notification;

    return msg;
  } else if (msg.event === "notification-delete") {
    const deleteAnswer = {
      event: msg.event,
      message: "Notification deleted",
      source: "WSNotificationHandler",
      requestID: msg.requestID,
      data: {
        success: true,
      },
    };

    db.del("notifications", ["id"], [msg.data.id]);

    const sql = `SELECT * FROM notifications ORDER BY ts`;
    deleteAnswer.data.notifications = db.get(sql);
    return deleteAnswer;
  } else if (msg.event === "notification-delete-all") {
    const deleteAnswer = {
      event: msg.event,
      message: "All notifications deleted",
      source: "WSNotificationHandler",
      requestID: msg.requestID,
      data: {
        success: true,
      },
    };

    db.execute("DELETE FROM notifications");

    deleteAnswer.data.notifications = [];
    return deleteAnswer;
  } else if (msg.event === "notification-update") {
    // just update the isUnread field without sending an answer
    //
    let sIds = "";
    msg.data.ids.forEach((id) => {
      if (sIds !== "") sIds += ",";
      sIds += id;
    });
    sIds = `(${sIds})`;
    db.execute(`UPDATE notifications SET isUnread = 0 WHERE id IN ${sIds}`);
    return null;
  }
}

module.exports = {
  handle,
};
