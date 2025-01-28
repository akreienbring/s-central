/*
  Author: André Kreienbring
  The http server creates webservice endpoints that are used by clients
  to get or post data. 
  All data is send and received as JSON.
  Static data (such as images) is served from the /public folder
*/

const express = require("express");
const cors = require("cors");
const path = require("path");
const endpoints = require("@http/endpoints.js");

const server = express();

server.use(cors());
server.use(express.json());

/**
  'Main' webservice that returns all configured devices.
  @returns  {json} All devices after they were enriched with Shelly device data
*/
server.get("/ws/v1/GetDevices", (req, res) => {
  console.log("-----Endpoint GetDevices was called-----");
  if (typeof req.query.ip != "undefined") {
    endpoints
      .getDeviceByIP(req.query.ip)
      .then((device) => {
        return res.json(device);
      })
      .catch((err) => {
        return res.json(err);
      });
  } else {
    endpoints
      .getDevices()
      .then((devices) => {
        return res.json(devices);
      })
      .catch((err) => {
        return res.json(err);
      });
  }
});

/**
  Returns script information of a device.
  @param {string}  ip The IP adress of a device
  @param {number}  [id] The ID of a script
  @returns {json} If id was not provided all scripts are returned. Else the script with the given id
*/
server.get("/ws/v1/GetScripts", (req, res) => {
  console.log("-----Endpoint GetScripts was called------");
  if (
    typeof req.query.ip != "undefined" &&
    typeof req.query.id != "undefined"
  ) {
    endpoints
      .getScriptByID(req.query.ip, Number(req.query.id))
      .then((script) => {
        return res.json(script);
      })
      .catch((err) => {
        return res.json(err);
      });
  } else {
    if (typeof req.query.ip != "undefined") {
      endpoints
        .getScripts(req.query.ip)
        .then((scripts) => {
          return res.json(scripts);
        })
        .catch((err) => {
          return res.json(err);
        });
    } else {
      return res.json({
        status: 400,
        error: "No IP provided",
        message: "Provide an IP like '?ip:123.456.789.1'",
      });
    }
  }
});

/**
  'Updates' properties (such as script status or KVS keys) of a configured device. 
  @param {string}  ip The IP adress of a device
  @param {json}  body The property to update as json object
  @returns {json} The updated device
*/
server.post("/ws/v1/SetDevice", (req, res) => {
  console.log("-----Endpoint SetDevice was called------");
  if (typeof req.body == "object" && typeof req.query.ip != "undefined") {
    return res.json(endpoints.setDevice(req.body, req.query.ip));
  } else {
    return res.json({
      status: 400,
      error: "Missing information ",
      message:
        "Provide a device property in the request body and an IP like '?ip:123.456.789.1'",
    });
  }
});

/**
  'Updates' the status of a script of a configured device. 
  @param {string}  ip The IP adress of a device
  @param {number}  id The ID of a script
  @param {json}  body The status of the script as json object
  @returns {json} The updated script
*/
server.post("/ws/v1/SetScript", (req, res) => {
  console.log("-----Endpoint SetScript was called------");
  if (
    typeof req.body == "object" &&
    typeof req.query.ip != "undefined" &&
    typeof req.query.id != "undefined"
  ) {
    return res.json(
      endpoints.setScript(req.body, req.query.ip, Number(req.query.id))
    );
  } else {
    return res.json({
      status: 400,
      error: "Missing information ",
      message:
        "Provide a script property in the request body, an IP like '?ip:123.456.789.1' and an ID like '&id=1'",
    });
  }
});

/**
  'Updates' valus of a KVS key of a configured device. 
  @param {number}  id The ID of a device (ID is a Shelly system setting)
  @param {json}  body Key and value of the KVS entry as json object
  @returns {json} The updated device
*/
server.post("/ws/v1/SetKVS", (req, res) => {
  console.log("-----Endpoint SetKVS was called------");
  if (typeof req.body == "object" && typeof req.query.id != "undefined") {
    return res.json(endpoints.setKVS(req.body, req.query.id));
  } else {
    return res.json({
      status: 400,
      error: "Missing information ",
      message:
        "Provide a KVS key/value pair in the request body and a Shelly device id like'shellyplus...'",
    });
  }
});

server.use(express.static("public"));
// handle every other route with index.html
server.get("*", function (req, res) {
  res.sendFile(path.resolve("./public/index.html"));
});

module.exports = server;
