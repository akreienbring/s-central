/*
  Author: André Kreienbring
  Contains database related functions. 
*/

/*
  Called when wshandler is loaded. 
  @param {object} theDB The (already open) database
*/
function initDB(db) {
  createConsupmtionTables(db);
  createUserTables(db);
  createNotificationTable(db);
  createBlogpostTable(db);
}

/*
  Creates several tables and triggers.
  If they don't exist! Can therefor be called many times.
  @param {object} theDB The (already open) database
*/
function createConsupmtionTables(db) {
  /*
    The 'cBy[period]' tables contain timeline information for the respective period.
    For each of this tables a trigger is defined, that deletes old data. 
  */
  sql = `CREATE TABLE IF NOT EXISTS cByMinute (
      device_id NOT NULL,
      device_cname NOT NULL,
      ts NOT NULL,
      minute NOT NULL,
      consumption NOT NULL,
      CONSTRAINT one_per_minute UNIQUE(device_id, minute)
      )`;

  db.exec(sql);

  sql = `CREATE TRIGGER IF NOT EXISTS max60minutes BEFORE INSERT ON cByMinute
      BEGIN
        DELETE FROM cByMinute WHERE 
          DATETIME(ts, 'unixepoch') <= DATETIME('now', '-1 hour', '+1 minute');
      END`;

  db.exec(sql);

  sql = `CREATE TABLE IF NOT EXISTS cByHour (
      device_id NOT NULL,
      device_cname NOT NULL,
      ts NOT NULL,
      hour NOT NULL,
      consumption NOT NULL,
      CONSTRAINT one_per_hour UNIQUE(device_id, hour)
      )`;

  db.exec(sql);

  sql = `CREATE TRIGGER IF NOT EXISTS max24hours BEFORE INSERT ON cByHour
      BEGIN
        DELETE FROM cByHour WHERE 
          DATETIME(ts, 'unixepoch') <= DATETIME('now', '-1 day');
      END`;

  db.exec(sql);

  sql = `CREATE TABLE IF NOT EXISTS cByDay (
      device_id NOT NULL,
      device_cname NOT NULL,
      ts NOT NULL,
      day NOT NULL,
      consumption NOT NULL,
      CONSTRAINT one_per_day UNIQUE(device_id, day)
      )`;

  db.exec(sql);

  sql = `CREATE TRIGGER IF NOT EXISTS max30days BEFORE INSERT ON cByDay
      BEGIN
        DELETE FROM cByDay WHERE 
          DATE(ts, 'unixepoch') <= DATE('now', '-1 month');
      END`;

  db.exec(sql);

  sql = `CREATE TABLE IF NOT EXISTS cByMonth (
      device_id NOT NULL,
      device_cname NOT NULL,
      ts NOT NULL,
      month NOT NULL,
      consumption NOT NULL,
      CONSTRAINT one_per_month UNIQUE(device_id, month)
      )`;

  db.exec(sql);

  sql = `CREATE TRIGGER IF NOT EXISTS max12month BEFORE INSERT ON cByMonth
      BEGIN
        DELETE FROM cByMonth WHERE 
           DATE(ts, 'unixepoch') <= DATE('now', '-1 year');
      END`;

  db.exec(sql);

  sql = `CREATE TABLE IF NOT EXISTS cByYear (
      device_id NOT NULL,
      device_cname NOT NULL,
      ts NOT NULL,
      year NOT NULL,
      consumption NOT NULL,
      CONSTRAINT one_per_year UNIQUE(device_id, year)
      )`;

  db.exec(sql);
}

function createUserTables(db) {
  sql = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    uuid TEXT UNIQUE NOT NULL,
    alias TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    firstname TEXT,
    lastname TEXT,
    home TEXT NOT NULL,
    hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    HA1 TEXT NOT NULL,
    roleid INTEGER NOT NULL,
    FOREIGN KEY(roleid) REFERENCES roles(id)
  )`;

  db.exec(sql);

  sql = `CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  )`;

  db.exec(sql);
}

function createNotificationTable(db) {
  sql = `CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY,
      type NOT NULL,
      device_ip NOT NULL,
      device_cname NOT NULL,
      script_id NOT NULL,
      script_name NOT NULL,
      notification NOT NULL,
      isUnread NOT NULL,
      ts NOT NULL
    )`;

  db.exec(sql);
}

function createBlogpostTable(db) {
  sql = `CREATE TABLE IF NOT EXISTS blogposts (
      id INTEGER PRIMARY KEY,
      title NOT NULL,
      content NOT NULL,
      createdAt NOT NULL,
      public INTEGER NOT NULL,
      userid NOT NULL,
      FOREIGN KEY(userid) REFERENCES users(id)
    )`;

  db.exec(sql);
}

module.exports = {
  initDB,
};
