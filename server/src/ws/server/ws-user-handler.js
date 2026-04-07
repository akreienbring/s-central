/*
  Author: André Kreienbring
  Handles websocket messages related with user management.
*/
const endecrypt = require("@src/utils/endecrypt.js");
const digest = require("@src/utils/digest.js");

const db = require("@db/db.js");
const config = require("config");

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
  if (msg.event === "user-validate") {
    /*
      Client send a validat request AFTER already completing the
      digest challenge response cyle. That means that his credentials
      are successfully validated by MessageValidator at this point.
     */
    const userToValidate = msg.data.user;

    const validateAnswer = {
      event: msg.event,
      requestID: msg.requestID,
      message: `OK, will validate the User ${userToValidate.email}`,
      source: "WSUserHandler",
      data: {
        requestResult: {
          success: true,
        },
      },
    };

    const sql = `SELECT hash, salt, users.id AS userid, uuid, email, firstname, lastname, home, alias, roles.name AS role, roles.id AS roleid FROM users INNER JOIN roles ON users.roleid = roles.id WHERE users.email = ?`;

    const row = db.getUser(sql, userToValidate.email);

    if (typeof row !== "undefined") {
      validateAnswer.data.user = {
        userid: row.userid,
        uuid: row.uuid,
        email: row.email,
        alias: row.alias,
        firstname: row.firstname,
        lastname: row.lastname,
        home: row.home,
        role: row.role,
        roleid: row.roleid,
        istest: userToValidate.istest, //used for cypress testing to indicate that a test is running
      };
      validateAnswer.secret = msg.secret;
    } else {
      validateAnswer.requestResult.success = false;
    }
    ws.send(JSON.stringify(validateAnswer));
  } else if (msg.event === "user-resetpw") {
    // client wants to reset the pw.
    const resetAnswer = {
      event: msg.event,
      message: "_resetpw_",
      source: "WSUserHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
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
        password,
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
            [msg.data.email],
          );

          if (info?.changes !== 1) {
            console.error(
              `Expected to reset 1 password, but resetted ${info.changes} passwords.`,
            );
            resetAnswer.data.requestResult.message = "_notresetpw_";
            resetAnswer.data.requestResult.success = false;
          }
        } catch (err) {
          console.error(err.message);
          resetAnswer.data.requestResult.message = "_notresetpw_";
          resetAnswer.data.requestResult.success = false;
        }

        ws.send(JSON.stringify(resetAnswer));
      });
    } else {
      console.error(`User with email ${msg.data.email} was not found`);
      resetAnswer.data.requestResult.success = false;
      resetAnswer.data.requestResult.message = "_usernotexists_";
    }

    ws.send(JSON.stringify(resetAnswer));
  } else if (msg.event === "users-get-all") {
    const usersAnswer = {
      event: msg.event,
      message: "OK! Here are all the users",
      source: "WSUserHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
      },
    };

    const sql = `SELECT users.id AS userid, uuid, email, firstname, lastname, home, alias, roles.name AS role, roles.id AS roleid FROM users INNER JOIN roles ON users.roleid = roles.id ORDER BY alias`;
    usersAnswer.data.users = db.getUser(sql);
    ws.send(JSON.stringify(usersAnswer));
  } else if (msg.event === "user-profile-update") {
    // client wants to update a user. Email and password are not affected
    const updateAnswer = {
      event: msg.event,
      message: "Ok, will update the users profile",
      source: "WSUserHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
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
        [userToUpdate.userid],
      );
      if (info.changes !== 1) {
        console.error(
          `Expected to update 1 user, but updated ${info.changes} users.`,
        );
        updateAnswer.data.requestResult.message = "_usernotupdated_";
        updateAnswer.data.requestResult.success = false;
      }
    } catch (err) {
      console.error(err.message);
      updateAnswer.data.requestResult.message = db.createMessageFromConflict(
        err.message,
        "_usernotupdated_",
      );
      updateAnswer.data.requestResult.success = false;
    }
    ws.send(JSON.stringify(updateAnswer));
  } else if (msg.event === "user-settings-update") {
    const settingsAnswer = {
      event: msg.event,
      message: "Ok, will update the users settings",
      source: "WSUserHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
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
        [userToUpdate.userid],
      );
      if (info.changes !== 1) {
        console.error(
          `Expected to update 1 user, but updated ${info.changes} users.`,
        );
        settingsAnswer.data.requestResult.message = "_usernotupdated_";
        settingsAnswer.data.requestResult.success = false;
      }
    } catch (err) {
      console.error(err.message);
      settingsAnswer.data.requestResult.message = db.createMessageFromConflict(
        err.message,
        "_usernotupdated_",
      );
      settingsAnswer.data.requestResult.success = false;
    }
    ws.send(JSON.stringify(settingsAnswer));
  } else if (msg.event === "user-security-update") {
    // client wants to update a users credentials.
    const securityAnswer = {
      event: msg.event,
      message: "Ok, will update the users security settings",
      source: "WSUserHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
      },
    };

    const userToUpdate = msg.data.user;
    const HA1 = endecrypt.encryptUserHA1(
      userToUpdate.email,
      digest.REALM,
      userToUpdate.password,
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
          [userToUpdate.userid],
        );
        if (info.changes !== 1) {
          console.error(
            `Expected to update 1 user, but updated ${info.changes} users.`,
          );
          securityAnswer.data.requestResult.message = "_usernotupdated_";
          securityAnswer.data.requestResult.message.success = false;
        }
      } catch (err) {
        console.error(err.message);
        securityAnswer.data.requestResult.message =
          db.createMessageFromConflict(err.message, "_usernotupdated_");
        securityAnswer.data.requestResult.success = false;
      }
      ws.send(JSON.stringify(securityAnswer));
    });
  } else if (msg.event === "user-create") {
    // client wants to create a user
    const createAnswer = {
      event: msg.event,
      message: "Ok, will create a new user",
      source: "WSUserHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
      },
    };

    const userToCreate = msg.data.user;
    const password = config.get("db.standardpw");
    const HA1 = endecrypt.encryptUserHA1(
      userToCreate.email,
      digest.REALM,
      password,
    );
    endecrypt.encrypt(password).then((secret) => {
      console.log(
        "wsserver: Inserting new user with standard password into the database",
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
          false,
        );

        if (info?.changes !== 1) {
          console.error(
            `Expected to create 1 user, but created ${info.changes} users.`,
          );
          createAnswer.data.requestResult.message = "_usernotcreated_";
          createAnswer.data.requestResult.success = false;
        } else {
          const sql = `SELECT users.id AS userid, uuid, email, firstname, lastname, home, alias, roles.name AS role, roles.id AS roleid FROM users INNER JOIN roles ON users.roleid = roles.id ORDER BY alias`;
          createAnswer.data.users = db.getUser(sql);
        }
      } catch (err) {
        console.error(err.message);
        createAnswer.data.requestResult.message = db.createMessageFromConflict(
          err.message,
          "_usernotcreated_",
        );
        createAnswer.data.requestResult.success = false;
      }

      ws.send(JSON.stringify(createAnswer));
    });
  } else if (msg.event === "user-delete") {
    // client wants to delete a user
    const deleteAnswer = {
      event: msg.event,
      message: "Ok, will delete the user",
      source: "WSUserHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
      },
    };

    const searches = new Array(msg.data.ids.length).fill("id");
    const info = db.del("users", searches, msg.data.ids, "OR");

    if (info.changes !== msg.data.ids.length) {
      console.error(
        `Expected to create ${msg.data.ids.length} users, but users ${info.changes} users.`,
      );
      deleteAnswer.data.requestResult.message = "_usernotdeleted_";
      deleteAnswer.data.requestResult.success = false;
      deleteAnswer.data.requestResult.total = msg.data.ids.length;
      deleteAnswer.data.requestResult.successful = info.changes;
    } else {
      //delete all device assignments of the user
      const assingment_searches = new Array(msg.data.ids.length).fill(
        "user_id",
      );
      db.del("user_devices", assingment_searches, msg.data.ids, "OR");

      const sql = `SELECT users.id AS userid, uuid, email, firstname, lastname, home, alias, roles.name AS role, roles.id AS roleid FROM users INNER JOIN roles ON users.roleid = roles.id ORDER BY alias`;
      deleteAnswer.data.users = db.getUser(sql);
    }
    ws.send(JSON.stringify(deleteAnswer));
  } else if (msg.event === "user-devices-get-all") {
    // clients needs the devices of a user

    const deviceAnswer = {
      event: msg.event,
      message: "Ok, here are all the user devices",
      source: "WSUserHandler",
      requestID: msg.requestID,
      data: {
        success: true,
      },
    };
    const sql = `SELECT device_id FROM user_devices WHERE user_id = ?`;
    const userdevices = db.get(sql, [msg.data.userid]);

    //userdevices is an array of objects. We want only the values.
    deviceAnswer.data.userdevices = userdevices.map((object) => {
      return object.device_id;
    });

    ws.send(JSON.stringify(deviceAnswer));
  } else if (msg.event === "user-devices-update") {
    // client wants to update the devices of a user
    const deviceUpdateAnswer = {
      event: msg.event,
      message: "Ok, will update the devices of a user",
      source: "WSUserHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
      },
    };
    const userdevices = msg.data.ids;
    const userid = msg.data.userid;
    let success = true;

    if (typeof userdevices !== "undefined" && typeof userid !== "undefined") {
      //delete all previous assignments and add the new ones
      db.del("user_devices", ["user_id"], [userid]);

      for (let i in userdevices) {
        const info = db.insert(
          "user_devices",
          {
            user_id: userid,
            device_id: userdevices[i],
          },
          false,
        );
        if (info?.changes !== 1) {
          success = false;
        }
      }
    } else {
      console.error("Either userid or userdevices were not provided");
      deviceUpdateAnswer.data.requestResult.success = false;
      ws.send(JSON.stringify(deviceUpdateAnswer));

      return;
    }

    if (!success) {
      console.error(`Could not add ${userdevices.length} to user ${userid}`);
    } else {
      console.log(`User ${userid} now manages ${userdevices.length} devices`);
    }

    deviceUpdateAnswer.data.requestResult.success = success;
    ws.send(JSON.stringify(deviceUpdateAnswer));
  }
}

module.exports = {
  handle,
};
