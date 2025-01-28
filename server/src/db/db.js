/*
  Author: André Kreienbring
  Contains database related functions. ALL DB commands should be accessed
  via this wrapper.
*/
const sqlite3 = require("better-sqlite3");
const config = require("config");
const init = require("./init.js");
const endecrypt = require("@src/utils/endecrypt.js");
const digest = require("@src/utils/digest.js");
const dbutils = require("./db-utils.js");

let db;

/**
  Called when wshandler is loaded. Opens the database.
  The database is initialized (Tables are created if they don't exist)
  Standard roles and users are created (if they don't exist)
*/
function open() {
  db = new sqlite3("broker.db", {}, (err) => {
    // db = new sqlite3("broker.db", { verbose: console.log }, (err) => {
    if (err) {
      return console.error(err.message);
    }
    db.pragma("journal_mode = WAL");
    console.log("Connected to the SQlite database.");
  });

  // deleteTables(["blogposts", "users", "roles"]); // FOR TESTING
  // deleteTables(["notifications"]);
  init.initDB(db);

  const password = config.get("db.standardpw");
  const email = config.get("db.standardem");
  const HA1 = endecrypt.encryptUserHA1(email, digest.REALM, password);
  endecrypt.encrypt(password).then((secret) => {
    console.log("wsserver: Inserting standard admin into the database");
    insert("roles", { id: 1, name: "Admin" }, true);
    insert("roles", { id: 2, name: "Blogger" }, true);
    insert("roles", { id: 3, name: "User" }, true);
    insert(
      "users",
      {
        id: 1,
        uuid: endecrypt.createUUID(),
        alias: config.get("db.standardal"),
        email,
        home: config.get("db.standardhome"),
        hash: secret.hash,
        salt: secret.salt,
        HA1,
        roleid: 1,
      },
      true
    );
  });
}

/*
  UNUSED. Closes the current database
*/
function close() {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Closed the database connection.");
  });
}

/**
  A simple wrapper for the exec statement
  @param {string} The SQL statment to execute
*/
function execute(sql) {
  db.exec(sql);
}

/**
  Checks if a given user exists in the db by using it's uuid.
  @param {object} The user to search for.
  @return {boolean} True if the user exists, false if not.
*/
function isExistingUser(user) {
  // check if the user exists
  const sql = `SELECT id FROM users WHERE uuid = ?`;
  const row = getUserByUUID(sql, user.uuid);

  if (typeof row !== "undefined") {
    return row.id === user.id;
  }
  return false;
}
/**
  Get user data from the database by the given UUID.
  The UUID can not be guessed and is used for reconnecting
  a user that was successfully validated before. (see ws-message-validator)
  @param {string} sql The select statement to execute.
  @param {string} uuid The uuid that identifies the user
  @return {object} The specific user
*/
function getUserByUUID(sql, uuid) {
  return db.prepare(sql).get(uuid);
}

/**
  Get user data from the database by email.
  @param {string} sql The select statement to execute.
  @param {string} [email] The email that identifies the user
  @return If the email is provided the specific user is returned
    If not all users are returned
*/
function getUser(sql, email) {
  if (typeof email !== "undefined") {
    return db.prepare(sql).get(email);
  } else {
    return db.prepare(sql).all();
  }
}

/**
  Reset the password of a user
  @param:{string} email The user is identified by his email
*/
function resetPW(email) {
  endecrypt.encrypt(config.get("db.standardpw")).then((secret) => {
    console.log(`wsserver: resetting password of user ${email}`);
    update(
      "users",
      {
        hash: secret.hash,
        salt: secret.salt,
      },
      ["email"],
      [email]
    );
  });
}

/**
  Get data from the database.
  @param {string} sql The select statement to execute.
  @return {array} The data fetched from the db
*/
function get(sql, criterias) {
  if (typeof criterias === "undefined") return db.prepare(sql).all();
  return db.prepare(sql).all(criterias);
}

/**
A generic delete function that build and executes an DELETE statement.
@param {string} table the table to delete an entry from.
@param {array} searches Fields that will be used for the WHERE clause
@param {array} criterias Will be used for the values of the WHERE clause.
@param {string} logical If more then one search fild is given. Must be: 'AND' (default) or 'OR'
@return {object} An info object with two properties:
  changes: is the number of changed rows
  lastInsertRowid: Can be ignored in the case of a delete
*/
function del(table, searches, criterias, logical) {
  const scolumns = dbutils.buildSearchCriterias(searches, criterias, logical);
  const sql = `DELETE FROM  ${table} WHERE ${scolumns}`;

  return db.prepare(sql).run(criterias);
}

/**
  A generic update function that build and executes an UPDATE statement.
  @param {string} table the table that must be updated.
  @param {object} fields The fields (col / value pairs) that will be updated in the table.
  @param {array} searches Fields that will be used for the WHERE clause
  @param {array} criterias Will be used for the values of the WHERE clause.
  @param {string} logical Mandatory if more then one search fild is given. Must be: 'AND' or 'OR'
  @return {object} An info object with two properties:
    changes: is the number of changed rows
    lastInsertRowid: Can be ignored in the case of an update
*/
function update(table, fields, searches, criterias, logical) {
  const fieldvalues = dbutils.buildFieldValues(fields);

  const scolumns = dbutils.buildSearchCriterias(searches, criterias, logical);
  const sql = `UPDATE ${table} SET ${fieldvalues.columns} WHERE ${scolumns}`;

  return db.prepare(sql).run(fieldvalues.values, criterias);
}

/**
 * Used for testing if tables must be deleted
 * @param {array} tables 
 */
function deleteTables(tables) {
  let sql;
  tables.forEach((table) => {
    sql = `DROP TABLE IF EXISTS ${table}`;
    console.log(`wssserver: dropping table: ${table}`);
    db.exec(sql);
  });
}

/**
  A generic insert that builds and excutes an 'INSERT OR IGNORE' statement.
  @param {string} table the table where the data will be inserted
  @param {object} inserts An object with (multiple) column/value pairs.
  @param {boolean} ignore If true errors will be ignored
  @return {object} An info object with two properties:
    changes: is the number of changed rows
    lastInsertRowid: Can be ignored in the case of an update
*/
function insert(table, inserts, ignore) {
  const tableValues = dbutils.buildTableValues(inserts);
  const sql = `INSERT ${ignore ? "OR IGNORE" : ""} INTO ${table} (${
    tableValues.columns
  }) VALUES (${tableValues.placeholders})`;
  return db.prepare(sql).run(tableValues.values);
}

/**
  A generic select that builds and excutes an 'SELECT' statement.
  @param {string} table the table where the data will be selected from.
  @param {array} fields The fields that will be selected from the table.
    Can be an empty array for all fields.
  @param {array} searches Fields that will be used for the WHERE clause
  @param {array} criterias Will be used for the values of the WHERE clause.
  @param {string} logical if more then one search field is given. Must be: 'AND' or 'OR'
  @param {string} orderBy An 'ORDER BY' clause that will be used for the "SELECT".
  @return {array} The resulting rows
*/
function select(table, fields, searches, criterias, logical, orderBy) {
  let values = "";
  fields.forEach((col, index) => {
    if (values !== "") values += ", ";
    values += col;
  });
  if (values === "") values = "*";

  if (searches.length > 0) {
    scolumns = dbutils.buildSearchCriterias(searches, criterias, logical);
    const sql = `SELECT ${values} FROM ${table} WHERE ${scolumns} ${
      typeof orderBy !== "undefined" ? ` ORDER BY ${orderBy}` : ""
    }`;
    const rows = db.prepare(sql).all(criterias);
    return rows;
  } else {
    const sql = `SELECT ${values} FROM ${table} ${
      typeof orderBy !== "undefined" ? `ORDER BY ${orderBy}` : ""
    }`;
    const rows = db.prepare(sql).all();
    return rows;
  }
}

/**
  If inserts or updates fail (likely due to UNIQUE Constraints), this function (tries to) generate a message
  that contains the reason of the conflict.
  If none of the possible conflict fields is found a standard message is returned.
  @param {string} errmessage The original error message returned by sqlite
  @param {string} standard  Will be returned if the reason of the conflict could not be detected
*/
function createMessageFromConflict(errmessage, standard) {
  console.error(errmessage);
  if (errmessage.includes("alias")) {
    return "_aliasexists_";
  } else if (errmessage.includes("email")) {
    return "_emailexists_";
  }
  return standard;
}

/**
  Inserts into or updates all the tables that contain consumption data.
  Gets called whenever wshandler receives a 'NotifyFullStatus' websocket message
  that contains consumption data.
  @param {string} device_id The Shelly device that send consumption data.
  @param {string} device_cname The name of the Shelly device.
  @param {number} currentPower The current power the device consumes.
  @param {number} ts the unix timestamp of the consumption.
*/
function updateConsumption(device_id, device_cname, currentPower, ts) {
  /*
    Check if entries must be made in the timeline tables.
    This is the case when a period changes.
  */
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  if (currentPower > 0) {
    let sql = `INSERT OR IGNORE INTO cByMinute (device_id, device_cname, ts, minute, consumption) VALUES
    (?, ?, ?, ?, ?)`;
    db.prepare(sql).run(device_id, device_cname, ts, minute, currentPower);

    sql = `INSERT INTO cByHour (device_id, device_cname, ts, hour, consumption) VALUES
    (?, ?, ?, ?, ?) ON CONFLICT (device_id, hour) DO UPDATE SET consumption = consumption + ? WHERE device_id = ? AND hour = ?`;
    db.prepare(sql).run(
      device_id,
      device_cname,
      ts,
      hour,
      currentPower,
      currentPower,
      device_id,
      hour
    );

    sql = `INSERT INTO cByDay (device_id, device_cname, ts, day, consumption) VALUES
    (?, ?, ?, ?, ?) ON CONFLICT (device_id, day) DO UPDATE SET consumption = consumption + ? WHERE device_id = ? AND day = ?`;
    db.prepare(sql).run(
      device_id,
      device_cname,
      ts,
      day,
      currentPower,
      currentPower,
      device_id,
      day
    );

    sql = `INSERT INTO cByMonth (device_id, device_cname, ts, month, consumption) VALUES
    (?, ?, ?, ?, ?) ON CONFLICT (device_id, month) DO UPDATE SET consumption = consumption + ? WHERE device_id = ? AND month = ?`;
    db.prepare(sql).run(
      device_id,
      device_cname,
      ts,
      month,
      currentPower,
      currentPower,
      device_id,
      month
    );

    sql = `INSERT INTO cByYear (device_id, device_cname, ts, year, consumption) VALUES
    (?, ?, ?, ?, ?) ON CONFLICT (device_id, year) DO UPDATE SET consumption = consumption + ? WHERE device_id = ? AND year = ?`;
    db.prepare(sql).run(
      device_id,
      device_cname,
      ts,
      year,
      currentPower,
      currentPower,
      device_id,
      year
    );
  }
}

module.exports = {
  open,
  close,
  execute,
  insert,
  select,
  update,
  updateConsumption,
  get,
  getUser,
  del,
  resetPW,
  isExistingUser,
  createMessageFromConflict,
};
