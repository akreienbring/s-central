/**
  Author: André Kreienbring
  Handles websocket messages related with blogposts.
*/

const db = require("@db/db.js");

/** 
  Handles messages sent by the frontend that are related to blog managment.
  @param {object} msg The message that was sent by the frontend.
  @returns {object} The (answer) message that will be send to the client
*/
function handle(msg) {
  if (msg.event === "blogposts-get-all") {
    const blogpostsAnswer = {
      event: msg.event,
      message: "OK! Here are all the blogposts",
      source: "BlogpostHandler",
      requestID: msg.requestID,
      data: {},
    };

    const sql = `SELECT blogposts.id AS blogpostid, title, content, createdAt, public, users.alias, users.firstname, users.lastname, users.id AS userid FROM blogposts INNER JOIN users ON blogposts.userid = users.id ORDER BY createdAt`;
    blogpostsAnswer.data.blogposts = db.get(sql);

    return blogpostsAnswer;
  } else if (msg.event === "blogposts-get-public") {
    const blogpostsAnswer = {
      event: msg.event,
      message: "OK! Here are all the public blogposts",
      source: "BlogpostHandler",
      requestID: msg.requestID,
      data: {},
    };

    const sql = `SELECT blogposts.id AS blogpostid, title, content, createdAt, public, users.alias, users.firstname, users.lastname, users.id AS userid FROM blogposts INNER JOIN users ON blogposts.userid = users.id WHERE public = ? ORDER BY createdAt`;
    blogpostsAnswer.data.blogposts = db.get(sql, [1]);

    return blogpostsAnswer;
  } else if (msg.event === "blogpost-create") {
    const createAnswer = {
      event: msg.event,
      message: "_blogpostcreated_",
      source: "BlogpostHandler",
      requestID: msg.requestID,
      data: {
        success: true,
      },
    };

    const blogpostToCreate = msg.data.blogpost;

    let info;
    try {
      info = db.insert(
        "blogposts",
        {
          title: blogpostToCreate.title,
          content: blogpostToCreate.content,
          createdAt: blogpostToCreate.createdAt,
          public: blogpostToCreate.public ? 1 : 0,
          userid: blogpostToCreate.userid,
        },
        false,
      );

      if (info?.changes !== 1) {
        // something went wrong
        console.error(info.changes);
        createAnswer.message = "_blogpostnotcreated_";
        createAnswer.data.success = false;
      } else {
        const sql = `SELECT blogposts.id AS blogpostid, title, content, createdAt, public, users.alias, users.firstname, users.lastname, users.id AS userid FROM blogposts INNER JOIN users ON blogposts.userid = users.id ORDER BY createdAt`;
        createAnswer.data.blogposts = db.get(sql);
      }
    } catch (err) {
      console.error(err.message);
      createAnswer.message = "_blogpostnotcreated_";
      createAnswer.data.success = false;
    }

    return createAnswer;
  } else if (msg.event === "blogpost-delete") {
    const deleteAnswer = {
      event: msg.event,
      message: "Blogpost deleted",
      source: "BlogpostHandler",
      requestID: msg.requestID,
      data: {
        success: true,
      },
    };

    db.del("blogposts", ["id"], msg.data.ids);

    const sql = `SELECT blogposts.id AS blogpostid, title, content, createdAt, public, users.alias, users.firstname, users.lastname, users.id AS userid FROM blogposts INNER JOIN users ON blogposts.userid = users.id ORDER BY createdAt`;
    deleteAnswer.data.blogposts = db.get(sql);
    return deleteAnswer;
  } else if (msg.event === "blogpost-update") {
    const updateAnswer = {
      event: msg.event,
      message: "_blogpostupdated_",
      source: "BlogpostHandler",
      requestID: msg.requestID,
      data: {
        success: true,
      },
    };

    const blogpostToUpdate = msg.data.blogpost;
    try {
      const info = db.update(
        "blogposts",
        {
          title: blogpostToUpdate.title,
          content: blogpostToUpdate.content,
          public: blogpostToUpdate.public ? 1 : 0,
        },
        ["id"],
        [blogpostToUpdate.id],
      );
      if (info.changes !== 1) {
        // something went wrong
        updateAnswer.message = "_blogpostnotupdated_";
        updateAnswer.data.success = false;
      } else {
        updateAnswer.id = blogpostToUpdate.id;
      }
    } catch (err) {
      console.error(err.message);
      updateAnswer.message = db.createMessageFromConflict(
        err.message,
        "_blogpostnotupdated_",
      );
      updateAnswer.data.success = false;
    }
    return updateAnswer;
  }
}

module.exports = {
  handle,
};
