/*
  Author: André Kreienbring
  ShellyGen2Conn provides methods to connect to GEN2+ devices.

  For clients that are displaying KVS keys, there's an additional
  configuration file (kvsdisplays.json) to map KVS key to more readable
  display text.
*/

const { get } = require("config");
const shellyAxios = require("@http/shellyAxios.js");
const kvsdisplays = require("@root/config/kvsdisplays.json");

/**
  After the loading of the main device information the properties of the device
  are transfered to the internal devices array.
  The information is then enhanced by the scripts and the KVS entries of the device
  @async
  @param {object} device mandatory The device that must be enriched with the retrieved data
  @param {object} data mandatory The data that was retrieved from a Shelly Gen2 device
  @param {string} clientImagePath The path to the device images on the client side.
  @returns {Promise<object>} The updated device
*/
async function createDevice(device, data, clientImagePath) {
  console.log(
    `Creating device of type ${data.app} with name ${device.cname} from received data`
  );
  device.online = true;
  device.name = data.app;
  device.gen = data.gen;
  device.fw_id = data.fw_id;
  device.id = data.id;
  device.image = `${clientImagePath}${device.name}.png`;
  device.wsmessages = {};
  return await getScripts(device)
    .then((device) =>
      getKVS(device).then((device) =>
        getSwitches(device).then((device) => getAvailableUpdates(device))
      )
    )
    .catch((err) => {
      console.error(err.message);
    });
  /*
    return Promise.all([
      getScripts(device),
      getKVS(device),
      getSwitches(device),
      getAvailableUpdates(device),
    ]);
    */
}
/**
  Is only used internally when a device is created after loading
  Returns all scripts of a given device
  @async
  @param {object} device The device to get the scripts from
  @returns {Promise<object>} the device with the added array of scripts. The array is empty if the 
  device does not support scripts.
*/
async function getScripts(device) {
  console.log("Getting scripts for the device " + device.cname);
  const res = await shellyAxios
    .postRPCMethod(device, "Script.List")
    .catch((err) => {
      console.error(err.message);
    });

  if (res.status === 200 && typeof res.data.result.scripts !== "undefined") {
    device.scripts = res.data.result.scripts;
    console.log(
      `Successfully got ${device.scripts.length} scripts of ${device.cname}`
    );
  } else {
    if (typeof res !== "undefined") {
      console.error(`Error:  ${res.status} ${res.message}`);
    }
    throw new Error(`Could not get Scripts of ${device.cname}`);
  }
  return device;
}

/**
  Is only used internally when a device is created after loading.
  Sets all KVS entries on a given device.
  Every KVS entry is enhanced by the values in kvsdisplay.json
  @async
  @param {object} device The device to enrich with KVS data
  @returns {Promise<object>} the device with the added array of KVS entries. The array is empty if the 
  device does not support KVS.
*/
async function getKVS(device) {
  console.log("Getting KVS entriess for the device " + device.cname);
  const arrKVS = [];
  const res = await shellyAxios
    .postRPCMethod(device, "KVS.GetMany")
    .catch((err) => {
      console.error(err.message);
    });

  if (res.status === 200 && typeof res.data.result.items !== "undefined") {
    const kvsentries = res.data.result.items;
    for (let entry of kvsentries) {
      const kvsdisplay = kvsdisplays[entry.key];
      arrKVS.push({
        key: entry.key,
        value: entry.value,
        ...(typeof kvsdisplay?.display !== "undefined" && {
          display: kvsdisplay.display,
        }),
        ...(typeof kvsdisplay?.style !== "undefined" && {
          style: kvsdisplay.style,
        }),
      });
    }
    console.log(
      `Successfully got ${arrKVS.length} KVS entries of ${device.cname}`
    );
  } else {
    if (typeof res !== "undefined") {
      console.error(`Error:  ${res.status} ${res.message}`);
    }
    throw new Error(`Could not get the KVS entries of ${device.cname}`);
  }
  device.kvs = arrKVS;
  return device;
}

/**
  Is only used internally when a device is created after loading.
  Creates an array with the switches of a device.
  A device can have up to 4 switches. The key in the "GetStatus" result
  is either 'switch:[x]' or 'rgwb:[x]'.
  @async
  @param {object} device The device to enrich with the array of switches
  @returns {Promise<object>} The device with the added array of switches. The array is empty if the 
  device does not support switches.
*/
async function getSwitches(device) {
  console.log("Getting Switches for the device " + device.cname);
  const arrSwitches = [];
  const res = await shellyAxios
    .postRPCMethod(device, "Shelly.GetStatus")
    .catch((err) => {
      console.error(err.message);
    });
  if (res.status === 200 && typeof res.data.result !== "undefined") {
    Object.keys(res.data.result).forEach((entry) => {
      if (entry.startsWith("switch") || entry.startsWith("rgbw")) {
        const aSwitch = res.data.result[entry];
        arrSwitches.push({
          deviceIp: device.ip,
          deviceId: device.id,
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
    device.switches = arrSwitches;
    console.log(
      `Successfully got ${device.switches.length} switches of ${device.cname}`
    );
  } else {
    if (typeof res !== "undefined") {
      console.error(`Error:  ${res.status} ${res.message}`);
    }
    throw new Error(`Could not get the Switches of ${device.cname}`);
  }
  return device;
}

/**
  Is only used internally when a device is created after loading
  Returns all available updates of a given device
  @async
  @param {object} device The device that may have available updates
  @returns {Promise<object>} the device with the added update information.
*/
async function getAvailableUpdates(device) {
  console.log("Getting available updates for the device " + device.cname);
  const res = await shellyAxios
    .postRPCMethod(device, "Shelly.CheckForUpdate")
    .catch((err) => {
      console.error(err.message);
    });

  if (res.status === 200) {
    console.log("Successfully got the available updates of " + device.cname);
    device.stable = res.data.result?.stable?.version;
    device.beta = res.data.result?.beta?.version;
  } else {
    if (typeof res !== "undefined") {
      console.error(`Error:  ${res.status} ${res.message}`);
    }
    throw new Error(`Could not get available updates of ${device.cname}`);
  }
  return device;
}

module.exports = {
  createDevice,
  getAvailableUpdates,
  getKVS,
  getScripts,
  getSwitches,
};
