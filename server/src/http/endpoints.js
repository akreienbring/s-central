/*
  Author: André Kreienbring
  Implementation of the endpoint functionality.
  Used by the http server when a webservice was called.
  When information is retrieved async funtions are used because
  GET requests are triggered to get information from the Shelly devices.
  When 'update' information is send, the internal device is updated and the data
  is forwarded to the websocket server.
*/

const shellyGen2Conn = require("@http/shellyGen2Conn.js");
const wsclient = require("@ws/client/wsclient.js");

/**
 *  
 * @returns {json} All configured devices
 */ 
async function getDevices() {
  return shellyGen2Conn
    .getDevices()
    .then((devices) => {
      console.log("Sending response for all devices");
      return devices;
    })
    .catch((err) => {
      return { error: err.message };
    });
}

/**
  Gets a device identified by its IP
  @param {string} ip The IP of a device
  @returns {json} A specific device identified by its IP
*/
async function getDeviceByIP(ip) {
  return shellyGen2Conn
    .getDevice(ip)
    .then((device) => {
      if (typeof device != "undefined") {
        console.log("Sending response for device with ip " + ip);
        return device;
      } else {
        return {
          status: 404,
          error: "Not found",
          message: `The device with the ip '${ip}' was not found`,
        };
      }
    })
    .catch((err) => {
      return { error: err.message };
    });
}

/**
  Gets the scripts of a device identified by its IP
  @param {string} ip The IP of a device
  @returns {json} All scripts of a device identified by its IP
*/
async function getScripts(ip) {
  return shellyGen2Conn
    .getDevice(ip)
    .then((device) => {
      if (typeof device != "undefined") {
        return device.scripts;
      } else {
        return {
          status: 404,
          error: "Not found",
          message: `The device with the ip '${ip}' was not found`,
        };
      }
    })
    .catch((err) => {
      return { error: err.message };
    });
}

/**
  Gets a specific script of a device
  @param {string} ip The IP of a device
  @param {number} id The ID of a script
  @returns {json} The script
*/
async function getScriptByID(ip, id) {
  return shellyGen2Conn
    .getDevice(ip)
    .then((device) => {
      if (typeof device != "undefined") {
        const script = shellyGen2Conn.findScript(device.ip, id);
        if (typeof script != "undefined") {
          return script;
        } else {
          return {
            status: 404,
            error: "Not found",
            message: `The script with the id '${id}' was not found`,
          };
        }
      } else {
        return {
          status: 404,
          error: "Not found",
          message: `The device with the ip '${ip}' was not found`,
        };
      }
    })
    .catch((err) => {
      return { error: err.message };
    });
}

/**
  Sets (updates) a device identified by its IP and sends it to the ws server
  @param {json} body The property and new value to set
  @param {string} ip The IP of a device
  @returns {json} The send body is returned to the client
*/
function setDevice(body, ip) {
  const device = shellyGen2Conn.findDevice(ip);
  if (typeof device != "undefined") {
    device.online = body.online;
    const message = {
      event: "ShellyUpdate",
      type: "device",
      data: {
        name: "Device Endpoint",
        message: `Device status changed to ${
          device.online ? "ONLINE" : "OFFLINE"
        }`,
        device,
      },
    };
    wsclient.send(message);
    return body;
  } else {
    return {
      status: 404,
      error: "Not found",
      message: `The device with the ip '${ip}' was not found.`,
    };
  }
}

/**
  Sets (updates) a script and sends it to the ws server
  @param {string} ip The IP of a device
  @param {number} id The ID of a script
  @param {json} body The property and new value to set
  @returns {json} The send body is returned to the client
*/
function setScript(body, ip, id) {
  const script = shellyGen2Conn.findScript(ip, id);
  const device = shellyGen2Conn.findDevice(ip);
  if (typeof script != "undefined") {
    script.running = body.running;
    const message = {
      event: "ShellyUpdate",
      type: "script",
      data: {
        name: "Script Endpoint",
        message: `Script status changed to ${
          script.running ? "RUNNING" : "NOT RUNNING"
        }`,
        device,
      },
    };
    wsclient.send(message);
    return body;
  } else {
    return {
      status: 404,
      error: "Not found",
      message: `The device with the ip '${ip}' or the script with the id '${id}' was not found.`,
    };
  }
}

/**
  Sets (updates) a KVS entry and sends it to the ws server
  @param {string} id The ID of a device (ID is a Shelly system setting)
  @param {json} body The key (of the KVS entry) and new value to set
  @returns {json} The send body is returned to the client
*/
function setKVS(body, id) {
  const device = shellyGen2Conn.findDeviceById(id);
  if (typeof device != "undefined") {
    const kvsentry = device.kvs.find((entry) => {
      return entry.key === body.key;
    });
    kvsentry.value = body.value;
    if (typeof kvsentry != "undefined") {
      const message = {
        event: "ShellyUpdate",
        type: "kvs",
        data: {
          source: "KVS Endpoint",
          message: `KVS entry ${kvsentry.key} changed to ${kvsentry.value}`,
          device,
        },
      };
      wsclient.send(message);
      return body;
    } else {
      return {
        status: 404,
        error: "Not found",
        message: `The KVS entry with the key '${body.key}' was not found.`,
      };
    }
  } else {
    return {
      status: 404,
      error: "Not found",
      message: `The device with the id '${id}' was not found.`,
    };
  }
}

module.exports = {
  getDevices,
  getDeviceByIP,
  getScripts,
  getScriptByID,
  setScript,
  setDevice,
  setKVS,
};
