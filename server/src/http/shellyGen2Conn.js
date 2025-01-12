/*
  Author: André Kreienbring
  Shelly Connector maintains a internal array of devices.
  These devices are initially loaded from a json file (devices.json)
  and then enriched by data requested from the Shelly devices that 
  are associated to the configured IP adresses.

  All methods to retrieve data from the array of internal devices 
  are implemented here. 

  For clients that are displaying KVS keys, there's an additional
  configuration file (kvsdisplays.json) to map KVS key to more readable
  display text.
*/

const devices = require("@root/config/devices.json");
const kvsdisplays = require("@root/config/kvsdisplays.json");
const logHandler = require("@src/utils/loghandler.js");
const shellyWSClient = require("@ws/client/shelly-wsclient.js");
const shellyConfigurator = require("./shellyconfigurator.js");
const shellyGen1Conn = require("./shellyGen1Conn.js");
const shellyAxios = require("./shellyAxios.js");
const wsclient = require("@ws/client/wsclient");

// The images must be stored on the client side
const clientImagePath = "/assets/images/devices/";

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
    shellyConfigurator.configureShellies(devices, getRPCMethod);

    console.log(`Getting full status every 60 seconds`);
    setInterval(() => {
      for (const device of devices) {
        if (device.gen > 1) {
          shellyWSClient.sendNotifyFullStatus(device);
        } else if (device.gen === 1) {
          shellyWSClient.sendGen1Status(device);
        }
      }
    }, 60 * 1000);
  });

  isLoaded = true;
})();

/*
  By clicking on a switch in the frontend the 'wsHandler' receives a message
  and will call this method to toggle a switch.
  Dependent on the device generation, the appropriate action will be taken.
  @param {object} aSwitch Has all the information to toggle a switch on a device.
*/
function toggleSwitch(aSwitch) {
  const device = findDevice(aSwitch.ip);
  if (typeof device !== "undefined") {
    device.switches[aSwitch.index] = aSwitch;

    if (device.gen > 1) {
      if (aSwitch.key.startsWith("switch")) {
        shellyWSClient.sendCommand(device, "Switch.Toggle", { id: aSwitch.id });
        /*
        getRPCMethod(device, "Switch.Toggle", { id: aSwitch.id }).catch(
          (err) => {
            console.error(err.message);
          }
        );
        */
      } else if (aSwitch.key.startsWith("rgbw")) {
        shellyWSClient.sendCommand(device, "RGBW.Toggle", { id: aSwitch.id });
        /*
        getRPCMethod(device, "RGBW.Toggle", { id: aSwitch.id }).catch((err) => {
          console.error(err.message);
        });
        */
      }
    } else if (device.gen === 1) {
      shellyGen1Conn.toggleSwitch(device.ip, aSwitch);
    }
  }
}

/*
  By altering the values of a switch in the frontend the 'wsHandler' receives a message
  and will call this method to set a switch.
  Dependent on the device generation, the appropriate action will be taken.
  @param {object} aSwitch Has all the information to set a switch on a device.
*/
function setSwitch(aSwitch) {
  const device = findDevice(aSwitch.ip);
  if (typeof device !== "undefined") {
    device.switches[aSwitch.index] = aSwitch;

    if (device.gen > 1) {
      if (aSwitch.key.startsWith("switch")) {
        // TODO: currently untested! Don't have such a device
        getRPCMethod(device, "Switch.Set", { id: aSwitch.id }).catch((err) => {
          console.error(err.message);
        });
      } else if (aSwitch.key.startsWith("rgbw")) {
        const params = {
          id: aSwitch.id,
          turn: aSwitch.output ? "on" : "off", // without this, 'Set' does not work
          brightness: aSwitch.brightness,
          white: aSwitch.white,
          rgb: aSwitch.rgb,
        };

        shellyWSClient.sendCommand(device, "RGBW.Set", params);
        /*
        getRPCMethod(device, "RGBW.Set", {
          id: aSwitch.id,
          turn: aSwitch.output ? "on" : "off", // without this, 'Set' does not work
          brightness: aSwitch.brightness,
          white: aSwitch.white,
          rgb: aSwitch.rgb,
        }).catch((err) => {
          console.error(err.message);
        });
        */
      }
    } else if (device.gen === 1) {
      shellyGen1Conn.setSwitch(device.ip, aSwitch);
    }
  }
}

/*
  When ShellyBroker receives an UDP message it will be handled by this function.
  If a device exists with the given source address, then the 10 recent log messages 
  will be added to the according script object.
  ATTENTION: This only works correct if the log output contains the name of the script.
  e.g. "logPrefix: [SCRIPTNAME]" where [SCRIPTNAME] equals the name of an existing script!
  @param {Buffer} msg mandatory A message that was received over UDP
  @param {Object} rinfo mandatory Holds additional info about the sender e.g. the sender IP
*/
function handleLogMessage(msg, rinfo) {
  // Only accept logs from configured devices
  const device = findDevice(rinfo.address);
  if (typeof device?.scripts === "undefined") return;

  logHandler.handleLogMessage(device, msg);
}

/*
  Searches and returns a device by its Shelly id
  @param {number} id mandatory The Shelly id of a device
  @returns The device with the given id or 'undefined' if the device was not found.
*/
function findDeviceById(id) {
  return devices.find((device) => {
    return device.id === id;
  });
}

/*
  Searches and returns a device by its ip
  @param {number} ip mandatory The IP of a device
  @returns The device with the given ip or 'undefined' if the device was not found.
*/
function findDevice(ip) {
  return devices.find((device) => {
    return device.ip === ip;
  });
}

/*
  Searches and returns a script of a device by its id
  @param {number} ip mandatory The IP of a device
  @param {number} id mandatory The ID of a script
  @returns The script with the given id or 'undefined' if the script was not found.
*/
function findScript(ip, id) {
  const device = findDevice(ip);
  if (typeof device != "undefined") {
    return device.scripts.find((script) => {
      return script.id === id;
    });
  } else {
    return undefined;
  }
}

/*
  Serves the entpoint 'GetDevices' and is called when the module is loaded.
  @returns {array} All the internal devices when all infomation was collected
*/
async function getDevices() {
  if (isLoaded) return devices;

  const promises = devices.map((device) => getDevice(device.ip));
  await Promise.all(promises);
  return devices;
}

/*
  Serves the entpoint 'GetDevice' and 'GetScripts'
  @param {string} ip mandatory The IP of a device
  @param {boolean} reload. If true the data from the device is refetched.
  @returns the device created from the response data or
    an 'unknown' device if the device could not be connected or it is not supported 
*/
async function getDevice(ip, reload) {
  console.log("Getting device with ip " + ip);
  const device = findDevice(ip);
  if (isLoaded && reload !== true) return device;

  const res = await shellyAxios.get(`http://${ip}/shelly`).catch((err) => {
    console.error(err.message);
    return createUnknownDevice(device, false, "unknown");
  });

  if (res.status === 200) {
    if (typeof res.data.app === "undefined") {
      if (typeof res.data.type !== "undefined")
        // the device is not supported but may have a 'type' property
        return await shellyGen1Conn.createGen1Device(
          device,
          res.data,
          clientImagePath
        );
      return createUnknownDevice(device, true, "unknown");
    }
    // the device is supported (gen2/3)
    return createDevice(device, res.data);
  } else {
    return createUnknownDevice(device, false, "unknown");
  }
}

/*
  Is only used internally when a device is created after loading
  Returns all scripts of a given device
  @param {object} device mandatory The device to get the scripts from
  @returns the device with the added array of scripts. The array is empty if the 
  device does not support scripts.
*/
async function getScripts(device) {
  console.log("Getting scripts for the device " + device.cname);
  const res = await getRPCMethod(device, "Script.List").catch((err) => {
    console.error(err.message);
  });
  if (res.status === 200 && typeof res.data.result.scripts !== "undefined") {
    console.log("Successfully got the scripts of " + device.cname);
    device.scripts = res.data.result.scripts;
  } else {
    if (typeof res !== "undefined") {
      console.error(`Error:  ${res.status} ${res.message}`);
    }
    throw new Error(`Could not get Scripts of ${device.cname}`);
  }
  return device;
}

/*
  Is only used internally when a device is created after loading.
  Sets all KVS entries on a given device.
  Every KVS entry is enhanced by the values in kvsdisplay.json
  @param {object} device mandatory The device to enrich with KVS data
  @returns the device with the added array of KVS entries. The array is empty if the 
  device does not support KVS.
*/
async function getKVS(device) {
  console.log("Getting KVS entriess for the device " + device.cname);
  const arrKVS = [];
  const res = await getRPCMethod(device, "KVS.GetMany").catch((err) => {
    console.error(err.message);
  });
  if (res.status === 200 && typeof res.data.result.items !== "undefined") {
    const kvsentries = res.data.result.items;
    Object.keys(kvsentries).forEach((entry) => {
      const kvsdisplay = kvsdisplays[entry];
      arrKVS.push({
        key: entry,
        value: kvsentries[entry].value,
        ...(typeof kvsdisplay.display !== "undefined" && {
          display: kvsdisplay.display,
        }),
        ...(typeof kvsdisplay.style !== "undefined" && {
          style: kvsdisplay.style,
        }),
      });
    });
    console.log("Successfully got the KVS entries of " + device.cname);
  } else {
    if (typeof res !== "undefined") {
      console.error(`Error:  ${res.status} ${res.message}`);
    }
    throw new Error(`Could not get the KVS entries of ${device.cname}`);
  }
  device.kvs = arrKVS;
  return device;
}

/*
  Is only used internally when a device is created after loading.
  Creates an array with the switches of a device.
  A device can have up to 4 switches. The key in the "GetStatus" result
  is either 'switch:[x]' or 'rgwb:[x]'.
  @param {object} device mandatory The device to enrich with the array of switches
  @returns the device with the added array of switches. The array is empty if the 
  device does not support switches.
*/
async function getSwitches(device) {
  console.log("Getting Switches for the device " + device.cname);
  const arrSwitches = [];
  const res = await getRPCMethod(device, "Shelly.GetStatus").catch((err) => {
    console.error(err.message);
  });
  if (res.status === 200 && typeof res.data.result !== "undefined") {
    Object.keys(res.data.result).forEach((entry) => {
      if (entry.startsWith("switch") || entry.startsWith("rgbw")) {
        const aSwitch = res.data.result[entry];
        arrSwitches.push({
          key: entry,
          id: aSwitch.id,
          output: aSwitch.output,
          brightness:
            typeof aSwitch.brightness !== "undefined"
              ? aSwitch.brightness
              : undefined,
          white:
            typeof aSwitch.white !== "undefined" ? aSwitch.white : undefined,
          rgb: typeof aSwitch.rgb !== "undefined" ? aSwitch.rgb : undefined,
        });
      }
    });
    console.log("Successfully got the Switches of " + device.cname);
  } else {
    if (typeof res !== "undefined") {
      console.error(`Error:  ${res.status} ${res.message}`);
    }
    throw new Error(`Could not get the Switches of ${device.cname}`);
  }
  if (typeof device.switches === "undefined") {
    // for testing: predefine switches in the devices.json
    device.switches = arrSwitches;
  }
  return device;
}

/*
  Used when a device could not be connected (is offline) or its gen is 0.
  The gen is considered as 0, when it does not return a 'type' attribute.
  Sets some information that is displayed on the frontend. 
  Empty arrays are added. This way the frontend does not need to check for undefined.
  @param {object} device mandatory The device that could not be connectd to or that is not supported
  @param {boolean} online The device was connected but has no 'type' attribute.
  @param {string} name The name of the device (maybe 'unknown')
  @returns {object} The updated device
*/
function createUnknownDevice(device, online, name) {
  console.log(
    `Creating device with unkwown type with name ${name} and IP ${device.ip}`
  );
  device.online = online;
  device.name = name;
  device.image = `${clientImagePath}unknown.png`;
  device.gen = 0;
  device.id = device.ip;
  device.scripts = [];
  device.kvs = [];
  device.switches = [];
  device.wsmessages = {};
  return device;
}

/*
  After the loading of the main device information the properties of the device
  are transfered to the internal devices array.
  The information is then enhanced by the scripts and the KVS entries of the device
  @param {object} device mandatory The device that must be enriched with the retrieved data
  @param {object} data mandatory The data that was retrieved from a Shelly Gen2 device
  @returns {object} The updated device
*/
async function createDevice(device, data) {
  console.log(
    `Creating device of type ${data.app} with name ${device.cname} from received data`
  );
  device.online = true;
  device.name = data.app;
  device.gen = data.gen;
  device.id = data.id;
  device.image = `${clientImagePath}${device.name}.png`;
  device.wsmessages = {};
  if (device.gen > 1) {
    return await Promise.all([
      getScripts(device),
      getKVS(device),
      getSwitches(device),
    ]);
  } else {
    return device;
  }
}

/*
  Calles the devices rpc interfaces
  @param {object} device mandatory The device the call will be send to.
  @param {string} method mandatory The RPC method that will be called.
  @param {object} params If provide this params will be added to the method.
  @returns {object} The response object.
*/
async function getRPCMethod(device, method, params) {
  return shellyAxios
    .request(
      `http://${device.ip}/rpc/`,
      "POST",
      method,
      params,
      device.password
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return shellyAxios.handleAxiosError(err);
    });
}

module.exports = {
  getDevices,
  getDevice,
  findDevice,
  findDeviceById,
  findScript,
  handleLogMessage,
  toggleSwitch,
  setSwitch,
};
