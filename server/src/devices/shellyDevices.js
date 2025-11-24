/*
  Author: André Kreienbring
  ShellyDevices maintains an internal array of devices.
  These devices are initially loaded from a json file (devices.json)
  and then enriched by data requested from the Shelly devices that 
  are associated to the configured IP adresses.

  All methods to retrieve data from the array of internal devices 
  are implemented here. 
*/
const devices = require("@root/config/devices.json");
const shellyConnector = require("@devices/shellyConnector.js");
const logHandler = require("@src/utils/loghandler.js");

/*
  the list of devices is only loaded once. All subsequend requests and updates
  are served and maintained on the devices in memory.
*/
let isLoaded = false;

/*
  Load all devices when the module is required with this 'anonymous function'
  If configured push the UDP and WS Settings to the shelly devices.
  An interval sends the status of each device (gen > 0) every minute to the wsHandler.
 */
(function () {
  getDevices().then((devices) => {
    // set outbound Websocket and UDP debug configuration on all devices.
    shellyConnector.configureShellies(devices);

    console.log(`Getting full status every 60 seconds`);
    setInterval(() => {
      shellyConnector.sendNotifyFullStatus(devices);
    }, 60 * 1000);
  });

  isLoaded = true;
})();

/**
  CURRENTLY UNUSED  
  Updates a device in the internal devices array.
  @param {number} id The id of the device to update
  @param {object} update The updated device object 
*/
function updateDeviceById(id, update) {
  let device = findDeviceById(id);
  device = update;
}

/**
  Searches and returns a device by its Shelly id
  @param {number} id mandatory The Shelly id of a device
  @returns {object} The device with the given id or 'undefined' if the device was not found.
*/
function findDeviceById(id) {
  return devices.find((device) => {
    return device.id === id;
  });
}

/**
  Searches and returns a device by its ip
  @param {string} ip The IP of a device
  @returns {object} The device with the given ip or 'undefined' if the device was not found.
*/
function findDeviceByIp(ip) {
  return devices.find((device) => {
    return device.ip === ip;
  });
}

/**
  Searches and returns a script of a device by its id
  @param {string} ip mandatory The IP of a device
  @param {number} id mandatory The ID of a script
  @returns {object} The script with the given id or 'undefined' if the script was not found.
*/
function findScript(ip, id) {
  const device = findDeviceByIp(ip);
  if (typeof device != "undefined") {
    return device.scripts.find((script) => {
      return script.id === id;
    });
  } else {
    return undefined;
  }
}

/**
  When ShellyBroker receives an UDP Log message it will be handled by this function.
  If a device exists with the given source address, then the 10 recent log messages 
  will be added to the according script object.
  ATTENTION: This only works correct if the log output contains the name of the script.
  e.g. "logPrefix: [SCRIPTNAME]" where [SCRIPTNAME] equals the name of an existing script!
  @param {Buffer} msg A message that was received over UDP
  @param {Object} rinfo Holds additional info about the sender e.g. the sender IP
*/
function handleLogMessage(msg, rinfo) {
  // Only accept logs from configured devices
  const device = findDeviceByIp(rinfo.address);
  if (typeof device?.scripts === "undefined" || device.scripts.length === 0)
    return;

  logHandler.handleLogMessage(device, msg);
}

/**
  Serves the entpoint 'GetDevices' and is called when the module is loaded.
  Once loaded the devices array is served from memory.
  @async
  @returns {array} All the internal devices when all infomation was collected
*/
async function getDevices() {
  if (isLoaded) return devices;

  const promises = devices.map((device) => getDevice(device.ip, false));
  await Promise.all(promises);
  return devices;
}

/**
  Serves the entpoint 'GetDevice' and 'GetScripts'
  @async
  @param {string} ip The IP of a device
  @param {boolean} reload. If true the data from the device is refetched.
  @returns {Promise<object>} the device created from the response data or
    an 'unknown' device if the device could not be connected or it is not supported 
*/
async function getDevice(ip, reload) {
  console.log("Getting device with ip " + ip);
  const device = findDeviceByIp(ip);
  if (isLoaded && !reload) return device;

  return await shellyConnector.getDevice(device);
}

module.exports = {
  getDevices,
  getDevice,
  findDeviceByIp,
  findDeviceById,
  updateDeviceById,
  findScript,
  handleLogMessage,
};
