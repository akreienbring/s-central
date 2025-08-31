/*
  Author: André Kreienbring
  ShellyConnector provides methods to connect to both, GEN1 and GEN2+ devices.
  As there are different interface implementations every method differenciates
  between the generations.
*/

const shellyWSClient = require("@ws/client/shelly-wsclient.js");
const shellyConfigurator = require("./shellyconfigurator.js");
const shellyGen1Conn = require("./shellyGen1Conn.js");
const shellyGen2Conn = require("./shellyGen2Conn.js");
const shellyAxios = require("@http/shellyAxios.js");

// The images must be stored on the client side
const clientImagePath = "/assets/images/devices/";

/**
 * Configures Gen2+ devices with WebSocket and UDP settings.
  After loading the devices, shellyDevices triggers this function once
  to send WebSocket and UDP configuration to all devices.
 * @param {array} devices 
 */
function configureShellies(devices) {
  shellyConfigurator.configureShellies(devices);
}

/**
  Sends a 'NotifyFullStatus' to the websocket server for each device.
  The status is then forwarded to all connected clients. 
 * @param {array} devices 
 */
function sendNotifyFullStatus(devices) {
  for (const device of devices) {
    if (device.gen > 1) {
      shellyWSClient.sendNotifyFullStatus(device);
    } else if (device.gen === 1) {
      shellyGen1Conn.sendNotifyFullStatus(device);
    }
  }
}

/**
  Toggles a switch on a device.
  Dependent on the device generation, the appropriate action will be taken.
  @param {object} device The device on which the switch must be set
  @param {object} aSwitch Has all the information to toggle a switch on a device.
*/
function toggleSwitch(device, aSwitch) {
  if (device.gen > 1) {
    if (aSwitch.key.startsWith("switch")) {
      shellyWSClient.sendCommand(device, "Switch.Toggle", { id: aSwitch.id });
    } else if (aSwitch.key.startsWith("rgbw")) {
      shellyWSClient.sendCommand(device, "RGBW.Toggle", { id: aSwitch.id });
    }
  } else if (device.gen === 1) {
    shellyGen1Conn.toggleSwitch(aSwitch, device.password);
  }
}

/**
  Sets a switch to the given values.
  Dependent on the device generation, the appropriate action will be taken.
  @param {object} device The device on which the switch must be set
  @param {object} aSwitch Has all the information to set a switch on a device.
*/
function setSwitch(device, aSwitch) {
  if (device.gen > 1) {
    if (aSwitch.key.startsWith("switch")) {
      // TODO: currently untested! Don't have such a device
      shellyAxios
        .postRPCMethod(device, "Switch.Set", { id: aSwitch.id })
        .catch((err) => {
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
    }
  } else if (device.gen === 1) {
    shellyGen1Conn.setSwitch(aSwitch, device.password);
  }
}

/**
  Enriches an existing device with data retrieved from the Shelly device
  @async
  @param {object} device the device to enricht with shelly device data
  @returns {Promise<object>} the device created from the response data or
    an 'unknown' device if the device could not be connected or it is not supported 
*/ async function getDevice(device) {
  const res = await shellyAxios
    .get(`http://${device.ip}/shelly`)
    .catch((err) => {
      console.error(err.message);
      return createUnknownDevice(device, false, "unknown");
    });

  if (res.status === 200) {
    if (typeof res.data.app === "undefined") {
      if (typeof res.data.type !== "undefined")
        // the device is Gen1
        return await shellyGen1Conn.createDevice(
          device,
          res.data,
          clientImagePath
        );
      return await createUnknownDevice(device, true, "unknown");
    }
    // the device is GEN > 1
    return await shellyGen2Conn.createDevice(device, res.data, clientImagePath);
  } else {
    return createUnknownDevice(device, false, "unknown");
  }
}

/**
  Used when a device could not be connected (is offline) or its gen is 0.
  The gen is considered as 0, when it does not return a 'type' attribute.
  Sets some information that is displayed on the frontend. 
  Empty arrays are added. This way the frontend does not need to check for undefined.
  @param {object} device The device that could not be connected to or that is not supported
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
  device.fw_id = "0.0.0";
  device.id = device.ip;
  device.scripts = [];
  device.kvs = [];
  device.switches = [];
  device.wsmessages = {};
  return device;
}

/**
  Reboots a device.
  Dependent on the device generation, the appropriate action will be taken.
  @param {object} device 
 */
function rebootDevice(device) {
  if (device.gen > 1) {
    shellyAxios
      .postRPCMethod(device, "Shelly.Reboot")
      .then((res) => {
        if (res?.status === 200) {
          console.log(`Reboot command sent to device ${device.cname}`);
        } else {
          console.error(
            `Failed to send reboot command to device ${device.cname}:`,
            res
          );
        }
      })
      .catch((error) => {
        console.error(`Error rebooting device ${device.cname}:`, error);
      });
  } else if (device.gen === 1) {
    shellyAxios
      .get(`http://${device.ip}/reboot`, device.password)
      .then((res) => {
        if (res?.status === 200) {
          console.log(`Reboot command sent to device ${device.cname}`);
        } else {
          console.error(
            `Failed to send reboot command to device ${device.cname}:`,
            res
          );
        }
      })
      .catch((error) => {
        console.error(`Error rebooting device ${device.cname}:`, error);
      });
  }
}

/**
  Updates a device to the stable firmware version.
  Dependent on the device generation, the appropriate action will be taken.
  @param {object} device 
 */
function updateToStable(device) {
  if (device.gen === 1) {
    /*
      Working example:
      http://192.168.68.33/ota?url=http://archive.shelly-tools.de/version/v1.12.1/SHPLG-S.zip
    */
    console.log(
      `Calling stable ota url: http://${device.ip}/ota?url=http://firmware.shelly.cloud/gen1/${device.name}.zip`
    );

    shellyAxios
      .get(
        `http://${device.ip}/ota?url=http://firmware.shelly.cloud/gen1/${device.name}.zip`,
        device.password
      )
      .then((res) => {
        if (res?.status === 200) {
          console.log(`Stable update command sent to device ${device.cname}`);
        } else {
          console.error(
            `Failed to send Stable update command to device ${device.cname}:`,
            res
          );
        }
      })
      .catch((error) => {
        console.error(
          `Error updating the device to a stable version ${device.cname}:`,
          error
        );
      });
  } else if (device.gen > 1) {
    shellyAxios
      .postRPCMethod(device, "Shelly.Update", { stage: "stable" })
      .then((res) => {
        if (res?.status === 200) {
          console.log(`Stable update command sent to device ${device.cname}`);
        } else {
          console.error(
            `Failed to send Stable update command to device ${device.cname}:`,
            res
          );
        }
      })
      .catch((error) => {
        console.error(
          `Error updating the device to a stable version ${device.cname}:`,
          error
        );
      });
  }
}

/**
  Updates a device to the beta firmware version.
  Dependent on the device generation, the appropriate action will be taken.
  @param {object} device 
*/
function updateToBeta(device) {
  if (device.gen === 1) {
    console.log(
      `Calling beta ota url: http://${device.ip}/ota?url=http://firmware.shelly.cloud/gen1/rc/${device.name}.zip`
    );
    shellyAxios
      .get(
        `http://${device.ip}/ota?url=http://firmware.shelly.cloud/gen1/rc/${device.name}.zip`,
        device.password
      )
      .then((res) => {
        if (res?.status === 200) {
          console.log(`Beta update command sent to device ${device.cname}`);
        } else {
          console.error(
            `Failed to send Beta Update command to device ${device.cname}:`,
            res
          );
        }
      })
      .catch((error) => {
        console.error(
          `Error while sending Beta Update command to device ${device.cname}:`,
          error
        );
      });
  } else if (device.gen > 1) {
    shellyAxios
      .postRPCMethod(device, "Shelly.Update", { stage: "beta" })
      .then((res) => {
        if (res?.status === 200) {
          console.log(`Beta update command sent to device ${device.cname}`);
        } else {
          console.error(
            `Failed to send Beta update command to device ${device.cname}:`,
            res
          );
        }
      })
      .catch((error) => {
        console.error(
          `Error while sending Beta Update command to device ${device.cname}:`,
          error
        );
      });
  }
}

/**
  Gets the wifi settings of a device.
  Dependent on the device generation, the appropriate action will be taken.
  @async
  @param {object} device The device to get the wifi settings from
  @returns {Promise<object>} The wifi settings of the device
 */
async function getWifiSettings(device) {
  if (device.gen === 1) {
    const res = await shellyAxios
      .get(`http://${device.ip}/settings/sta`, device.password)
      .catch((error) => {
        console.error(
          `Error getting wifi settings for device ${device.cname}:`,
          error
        );
      });

    if (res?.status === 200) {
      const settings = res.data;
      // map settings to Gen > 1 forma to prevent changing the client code
      return {
        ssid: settings.ssid,
        enable: settings.enabled,
        ipv4mode: settings.ipv4_method,
        ip: settings.ip,
        gw: settings.gw,
        netmask: settings.mask,
        nameserver: settings.dns,
      };
    } else {
      console.error(
        `Error getting wifi settings for device ${device.cname}:`,
        error
      );
    }
  } else if (device.gen > 1) {
    const res = await shellyAxios
      .postRPCMethod(device, "WiFi.GetConfig")
      .catch((error) => {
        console.error(
          `Error getting wifi settings for device ${device.cname}:`,
          error
        );
      });

    if (res?.status === 200) {
      return res.data.result.sta;
    } else {
      console.error(
        `Error getting wifi settings for device ${device.cname}:`,
        error
      );
    }
  }
}

/**
  Sets the wifi settings of a device.
  Dependent on the device generation, the appropriate action will be taken.
  @async
  @param {object} device The device to get the wifi settings from
  @param {object} wifiSettings The new wifi settings of the device
  @param {number} n Used for promise chaining to count the number of successful settings
  @returns {Promise<boolean>} Returns true if the settings were set, false otherwise
 */
async function setWifiSettings(device, wifiSettings, n) {
  console.log(`setWifiSettings called for device ${device.cname}`);
  // for testing promise chaining
  // if (Math.random() > 0.5) return n + 1;
  // return n;

  if (device.gen === 1) {
    const res = await shellyAxios
      /*  TODO: currently not working. Protected Shelly Gen1 devices only support GET for setting wifi settings???
    .postGen1(
        `http://${device.ip}/settings/sta`,
        {
          ssid: wifiSettings.ssid,
          key: wifiSettings.password,
          enabled: wifiSettings.enable,
        },
        device.password
      )
    */ .get(
        `http://${device.ip}/settings/sta?ssid=${wifiSettings.ssid}&key=${wifiSettings.password}&enabled=${wifiSettings.enable}`,
        device.password
      )
      .catch((error) => {
        console.error(
          `Error setting wifi settings for device ${device.cname}:`,
          error
        );
      });

    if (res?.status === 200) {
      return n + 1;
    }
    return n;
  } else if (device.gen > 1) {
    const config = {
      config: {
        sta: {
          ssid: wifiSettings.ssid,
          pass: wifiSettings.password,
          enable: wifiSettings.enable,
        },
      },
    };
    const res = await shellyAxios
      .postRPCMethod(device, "WiFi.SetConfig", config)
      .catch((error) => {
        console.error(
          `Error setting wifi settings for device ${device.cname}:`,
          error
        );
      });

    if (typeof res.data.error !== "undefined") {
      console.error(
        `Error setting wifi settings for device ${device.cname}:`,
        res.data.error
      );
      return n;
    }
    return n + 1;
  }
}

module.exports = {
  getDevice,
  toggleSwitch,
  setSwitch,
  configureShellies,
  sendNotifyFullStatus,
  rebootDevice,
  updateToStable,
  updateToBeta,
  getWifiSettings,
  setWifiSettings,
};
