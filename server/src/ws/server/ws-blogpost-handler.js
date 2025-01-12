/*
  Author: André Kreienbring
  Handles websocket messages related with blogposts.
*/

const db = require("@db/db.js");

function handle(msg, ws) {
  if (msg.event === "blogposts get all") {
    const blogpostsAnswer = {
      event: "blogposts get all",
      data: {
        message: "OK! Here are all the blogposts",
        requestID: msg.data.requestID,
      },
    };

    const sql = `SELECT blogposts.id AS blogpostid, title, content, createdAt, public, users.alias, users.firstname, users.lastname, users.id AS userid FROM blogposts INNER JOIN users ON blogposts.userid = users.id ORDER BY createdAt`;
    blogpostsAnswer.data.blogposts = db.get(sql);

    ws.send(JSON.stringify(blogpostsAnswer));
  } else if (msg.event === "blogposts get public") {
    const blogpostsAnswer = {
      event: "blogposts get public",
      data: {
        message: "OK! Here are all the public blogposts",
        requestID: msg.data.requestID,
      },
    };

    const sql = `SELECT blogposts.id AS blogpostid, title, content, createdAt, public, users.alias, users.firstname, users.lastname, users.id AS userid FROM blogposts INNER JOIN users ON blogposts.userid = users.id WHERE public = ? ORDER BY createdAt`;
    blogpostsAnswer.data.blogposts = db.get(sql, [1]);

    ws.send(JSON.stringify(blogpostsAnswer));
  } else if (msg.event === "blogpost create") {
    const createAnswer = {
      event: "blogpost create",
      data: {
        message: "_blogpostcreated_",
        success: true,
        requestID: msg.data.requestID,
      },
    };

    const blogpostToCreate = msg.data.blogpost;
    console.log(JSON.stringify(blogpostToCreate));

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
        false
      );

      if (info?.changes !== 1) {
        // something went wrong
        console.error(info.changes);
        createAnswer.data.message = "_blogpostnotcreated_";
        createAnswer.data.success = false;
      } else {
        const sql = `SELECT blogposts.id AS blogpostid, title, content, createdAt, public, users.alias, users.firstname, users.lastname, users.id AS userid FROM blogposts INNER JOIN users ON blogposts.userid = users.id ORDER BY createdAt`;
        createAnswer.data.blogposts = db.get(sql);
      }
    } catch (err) {
      console.error(err.message);
      createAnswer.data.message = "_blogpostnotcreated_";
      createAnswer.data.success = false;
    }

    ws.send(JSON.stringify(createAnswer));
  } else if (msg.event === "blogpost delete") {
    const deleteAnswer = {
      event: "blogpost delete",
      data: {
        message: "Blogpost deleted",
        success: true,
        requestID: msg.data.requestID,
      },
    };

    const info = db.del("blogposts", ["id"], msg.data.ids);

    const sql = `SELECT blogposts.id AS blogpostid, title, content, createdAt, public, users.alias, users.firstname, users.lastname, users.id AS userid FROM blogposts INNER JOIN users ON blogposts.userid = users.id ORDER BY createdAt`;
    deleteAnswer.data.blogposts = db.get(sql);
    ws.send(JSON.stringify(deleteAnswer));
  } else if (msg.event === "blogpost update") {
    const updateAnswer = {
      event: "blogpost update",
      data: {
        message: "_blogpostupdated_",
        success: true,
        requestID: msg.data.requestID,
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
        [blogpostToUpdate.id]
      );
      if (info.changes !== 1) {
        // something went wrong
        updateAnswer.data.message = "_blogpostnotupdated_";
        updateAnswer.data.success = false;
      } else {
        updateAnswer.id = blogpostToUpdate.id;
      }
    } catch (err) {
      console.error(err.message);
      updateAnswer.data.message = db.createMessageFromConflict(
        err.message,
        "_blogpostnotupdated_"
      );
      updateAnswer.data.success = false;
    }
    ws.send(JSON.stringify(updateAnswer));
  }
}

module.exports = {
  handle,
};
