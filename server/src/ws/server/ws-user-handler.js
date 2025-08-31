/*
  Author: André Kreienbring
  Handles websocket messages related with user management.
*/
const endecrypt = require("@src/utils/endecrypt.js");
const digest = require("@src/utils/digest.js");

const db = require("@db/db.js");
const config = require("config");

const SECRET = config.get("ws-server.secret");

/** 
  Handles messages sent by the frontend that are related to user managment.
  @param {object} msg The message that was sent by the frontend. Properties are:
    - {string} event mandatory Indicating an event that happened on the frontend.
    - {object} data mandatory Detailed information about the event. Properties are:
      - {string} channel optional Only set, when the channel must be stored for ongoing communication.
      - {string} name Can be used for logging the source of the message.
      - {string} message mandatory Can be used for logging information.
      - additional data that was added to the message.
  @param {object} ws The websocket that can be used to answer the client frontend
*/
function handle(msg, ws) {
  if (msg.event === "user validate") {
    /*
      Client send a login request AFTER already completing the
      digest challenge response cyle. That means that his credentials
      are successfully validated by Message Validation at this point.
     */
    const validateAnswer = {
      event: "user validate",
      data: {
        success: true,
        requestID: msg.data.requestID,
      },
    };

    const userToValidate = msg.data.user;
    const sql = `SELECT hash, salt, users.id AS userid, uuid, email, firstname, lastname, home, alias, roles.name AS rolename, roles.id AS roleid FROM users INNER JOIN roles ON users.roleid = roles.id WHERE users.email = ?`;

    const row = db.getUser(sql, userToValidate.email);

    if (typeof row !== "undefined") {
      if (
        /*
        Skip the password check, if the users digest authentication is valid.
        This way the password is NEVER send over the network
        This is only left here as a reminder.
      */
        typeof msg.data.secret === "undefined" // && !endecrypt.validate(userToValidate.password, row.hash, row.salt)
      ) {
        console.error("Digest Authentication has not worked!");
      } else {
        validateAnswer.data.user = {
          userid: row.userid,
          uuid: row.uuid,
          email: row.email,
          alias: row.alias,
          firstname: row.firstname,
          lastname: row.lastname,
          home: row.home,
          role: row.rolename,
          roleid: row.roleid,
        };
      }
    } else {
      validateAnswer.data.message = "_usernotexists_";
    }
    ws.send(JSON.stringify(validateAnswer));
  } else if (msg.event === "user resetpw") {
    // client wants to reset the pw.
    const resetAnswer = {
      event: "user resetpw",
      data: {
        message: "_resetpw_",
        success: true,
        requestID: msg.data.requestID,
      },
    };

    // check if the user exists
    const sql = `SELECT id FROM users WHERE email = ?`;

    const row = db.getUser(sql, msg.data.email);

    if (typeof row !== "undefined") {
      const password = config.get("db.standardpw");
      const HA1 = endecrypt.encryptUserHA1(
        msg.data.email,
        digest.REALM,
        password
      );
      endecrypt.encrypt(password).then((secret) => {
        console.log(`Resetting pw for ${msg.data.email}`);
        let info;
        try {
          info = db.update(
            "users",
            {
              hash: secret.hash,
              salt: secret.salt,
              HA1,
            },
            ["email"],
            [msg.data.email]
          );

          if (info?.changes !== 1) {
            // something went wrong
            resetAnswer.data.message = "_notresetpw_";
            resetAnswer.data.success = false;
          }
        } catch (err) {
          console.error(err.message);
          resetAnswer.data.message = db.createMessageFromConflict(
            err.message,
            "_notresetpw_"
          );
          resetAnswer.data.success = false;
        }

        ws.send(JSON.stringify(resetAnswer));
      });
    } else {
      resetAnswer.data.message = "_usernotexists_";
      resetAnswer.data.success = false;
    }

    ws.send(JSON.stringify(resetAnswer));
  } else if (msg.event === "users get all") {
    const usersAnswer = {
      event: "users get all",
      data: {
        message: "OK! Here are all the users",
        requestID: msg.data.requestID,
      },
    };

    const sql = `SELECT users.id AS userid, uuid, email, firstname, lastname, home, alias, roles.name AS rolename, roles.id AS roleid FROM users INNER JOIN roles ON users.roleid = roles.id ORDER BY alias`;
    usersAnswer.data.users = db.getUser(sql);
    ws.send(JSON.stringify(usersAnswer));
  } else if (msg.event === "user profile update") {
    // client wants to update a user. Email and password are not affected
    const updateAnswer = {
      event: "user profile update",
      data: {
        message: "_userupdated_",
        success: true,
        requestID: msg.data.requestID,
      },
    };

    const userToUpdate = msg.data.user;
    try {
      const info = db.update(
        "users",
        {
          alias: userToUpdate.alias,
          firstname: userToUpdate.firstname,
          lastname: userToUpdate.lastname,
          roleid: userToUpdate.roleid,
        },
        ["id"],
        [userToUpdate.userid]
      );
      if (info.changes !== 1) {
        // something went wrong
        updateAnswer.data.message = "_usernotupdated_";
        updateAnswer.data.success = false;
      }
    } catch (err) {
      console.error(err.message);
      updateAnswer.data.message = db.createMessageFromConflict(
        err.message,
        "_usernotupdated_"
      );
      updateAnswer.data.success = false;
    }
    ws.send(JSON.stringify(updateAnswer));
  } else if (msg.event === "user settings update") {
    const settingsAnswer = {
      event: "user settings update",
      data: {
        message: "_userupdated_",
        success: true,
        requestID: msg.data.requestID,
      },
    };

    const userToUpdate = msg.data.user;

    try {
      const info = db.update(
        "users",
        {
          home: userToUpdate.home,
        },
        ["id"],
        [userToUpdate.userid]
      );
      if (info.changes !== 1) {
        // something went wrong
        settingsAnswer.data.message = "_usernotupdated_";
        settingsAnswer.data.success = false;
      }
    } catch (err) {
      console.error(err.message);
      settingsAnswer.data.message = db.createMessageFromConflict(
        err.message,
        "_usernotupdated_"
      );
      settingsAnswer.data.success = false;
    }
    ws.send(JSON.stringify(settingsAnswer));
  } else if (msg.event === "user security update") {
    // client wants to update a users credentials.
    const securityAnswer = {
      event: "user security update",
      data: {
        message: "_userupdated_",
        success: true,
        requestID: msg.data.requestID,
      },
    };

    const userToUpdate = msg.data.user;
    const HA1 = endecrypt.encryptUserHA1(
      userToUpdate.email,
      digest.REALM,
      userToUpdate.password
    );
    endecrypt.encrypt(userToUpdate.password).then((secret) => {
      try {
        const info = db.update(
          "users",
          {
            email: userToUpdate.email,
            hash: secret.hash,
            salt: secret.salt,
            HA1,
          },
          ["id"],
          [userToUpdate.userid]
        );
        if (info.changes !== 1) {
          // something went wrong
          securityAnswer.data.message = "_usernotupdated_";
          securityAnswer.data.success = false;
        }
      } catch (err) {
        console.error(err.message);
        securityAnswer.data.message = db.createMessageFromConflict(
          err.message,
          "_usernotupdated_"
        );
        securityAnswer.data.success = false;
      }
      ws.send(JSON.stringify(securityAnswer));
    });
  } else if (msg.event === "user create") {
    // client wants to create a user
    const createAnswer = {
      event: "user create",
      data: {
        message: "_usercreated_",
        success: true,
        requestID: msg.data.requestID,
      },
    };

    const userToCreate = msg.data.user;
    const password = config.get("db.standardpw");
    const HA1 = endecrypt.encryptUserHA1(
      userToCreate.email,
      digest.REALM,
      password
    );
    endecrypt.encrypt(password).then((secret) => {
      console.log(
        "wsserver: Inserting new user with standard password into the database"
      );

      let info;
      try {
        info = db.insert(
          "users",
          {
            uuid: endecrypt.createUUID(),
            alias: userToCreate.alias,
            email: userToCreate.email,
            home: userToCreate.home,
            firstname: userToCreate.firstname,
            lastname: userToCreate.lastname,
            hash: secret.hash,
            salt: secret.salt,
            HA1,
            roleid: userToCreate.roleid,
          },
          false
        );

        if (info?.changes !== 1) {
          // something went wrong
          createAnswer.data.message = "_usernotcreated_";
          createAnswer.data.success = false;
        } else {
          const sql = `SELECT users.id AS userid, uuid, email, firstname, lastname, home, alias, roles.name AS rolename, roles.id AS roleid FROM users INNER JOIN roles ON users.roleid = roles.id ORDER BY alias`;
          createAnswer.data.users = db.getUser(sql);
        }
      } catch (err) {
        console.error(err.message);
        createAnswer.data.message = db.createMessageFromConflict(
          err.message,
          "_usernotcreated_"
        );
        createAnswer.data.success = false;
      }

      ws.send(JSON.stringify(createAnswer));
    });
  } else if (msg.event === "user delete") {
    // client wants to update a user
    const deleteAnswer = {
      event: "user delete",
      data: {
        message: "_userdeleted_",
        success: true,
        requestID: msg.data.requestID,
      },
    };

    const searches = new Array(msg.data.ids.length).fill("id");
    const info = db.del("users", searches, msg.data.ids, "OR");

    if (info.changes !== msg.data.ids.length) {
      // something went wrong
      deleteAnswer.data.message = "_usernotdeleted_";
      deleteAnswer.data.success = false;
    } else {
      const sql = `SELECT users.id AS userid, uuid, email, firstname, lastname, home, alias, roles.name AS rolename, roles.id AS roleid FROM users INNER JOIN roles ON users.roleid = roles.id ORDER BY alias`;
      deleteAnswer.data.users = db.getUser(sql);
    }
    ws.send(JSON.stringify(deleteAnswer));
  } else if (msg.event === "user devices get all") {
    // clients needs the devices of a user

    const deviceAnswer = {
      event: "user devices get all",
      data: {
        message: "Ok, here are all the user devices",
        success: true,
        requestID: msg.data.requestID,
      },
    };
    const sql = `SELECT device_id FROM user_devices WHERE user_id = ?`;
    const userdevices = db.get(sql, [msg.data.userid]);

    //userdevices is an array of objects. We want only the values.
    deviceAnswer.data.userdevices = userdevices.map((object) => {
      return object.device_id;
    });

    ws.send(JSON.stringify(deviceAnswer));
  } else if (msg.event === "user devices update") {
    // client wants to update the devices of a user
    const deviceUpdateAnswer = {
      event: msg.event,
      data: {
        message: "_devicesupdated_",
        success: true,
        requestID: msg.data.requestID,
      },
    };
    const userdevices = msg.data.userdevices;
    const userid = msg.data.userid;
    let success = true;

    let info = db.del("user_devices", ["user_id"], [userid]);
    for (i in userdevices) {
      info = db.insert(
        "user_devices",
        {
          user_id: userid,
          device_id: userdevices[i],
        },
        false
      );
      if (info?.changes !== 1) {
        success = false;
      }
    }
    if (!success) deviceUpdateAnswer.data.message = "_devicesnotupdated";
    deviceUpdateAnswer.data.success = success;
    ws.send(JSON.stringify(deviceUpdateAnswer));
  }
}

module.exports = {
  handle,
};
