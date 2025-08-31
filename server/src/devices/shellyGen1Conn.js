/*
    Author: André Kreienbring    
    Connects with Shelly Gen1 devices. Devices are considered to be Gen1 if
    the http://[ip]/shelly returns a 'type attribute.
    These devices have various methods to get information from. 
    The data will be mapped to the structur of Gen2/3 objects. This way
    the frontend can apply the same functionality. 
*/
const shellyAxios = require("@http/shellyAxios.js");
const wsclient = require("@ws/client/wsclient");

/**
  Used when a device was identified as a Gen1 device.
  Some information is set on the device that is displayed on the frontend. 
  Empty arrays are added. This way the frontend does not need to check for undefined.
  @async
  @param {object} device The device that could not be connectd to or that is not supported
  @param {object} data The result of a http:/[ip]/shelly call. Contains e.g. the type property
  @param {string} clientImagePath The path to the device images on the client side.
  @returns {Promise<object>} The updated device
*/
async function createDevice(device, data, clientImagePath) {
  device.online = true;
  device.name = data.type;
  device.image = `${clientImagePath}${data.type}.png`;
  device.gen = 1;
  device.fw_id = data.fw;
  device.id = data.type + device.ip;
  device.scripts = [];
  device.kvs = [];
  device.switches = await getSwitches(device);
  device.wsmessages = {};
  device = await getAvailableUpdates(device);
  return device;
}

/**
  Creates an array with the switches of a Gen1 device.
  'lights' and 'relays' of Gen1 devices are converted to'switch:[X]' where X is the index of the switch.
  @async
  @param {object} device mandatory The device to enrich with the array of switches
  @returns {Promise<array>} The array of switches. The array is empty if the device does not have switches.
*/
async function getSwitches(device) {
  console.log("Getting Switches for the device " + device.cname);

  const res = await getStatus(device.ip, device.password);
  if (res.status === 200) {
    return buildSwitches(device.ip, res.data);
  }
  return [];
}

/**
  As Gen1 devices don't send notifications, this function builds the parts of
  a 'NotifyFullStatus' the client or websocket server need
  - to show the status of switches and 
  - create the power consumption values
  @async
  @param {object} device The device used to build a 'NotifyFullStatus' object
  @returns {Promise<object>} The 'NotifyFullStatus' object
*/
async function getNotifyFullStatus(device) {
  const res = await getStatus(device.ip, device.password).catch((err) => {
    console.error(err.message);
  });

  if (res.status === 200) {
    const status = res.data; //

    const notifyFullStatus = {
      src: device.name + device.ip,
      dst: "request",
      method: "NotifyFullStatus",
      params: {
        cloud: { connected: status.cloud.connected },
        sys: {
          ram_size: status.ram_total,
          ram_free: status.ram_free,
          fs_size: status.fs_size,
          fs_free: status.fs_free,
          uptime: status.uptime,
          restart_required: false, //Does not exixt for Gen1
          available_updates: {
            stable: { version: device.stable },
            beta: { version: device.beta },
          },
        },
      },
    };
    const date = new Date();
    notifyFullStatus.params.ts = Math.floor(date.getTime() / 1000);

    /*
      First build the switches from the status request result.
      For each existing switch the 'meters' array is queried.
      This assumes that every meters entry corresponds to exactly one switch property!
      This is NOT tested for all Shelly Models!
      'counters' contains the consumption in w/h. Convert to mw/m to be compatible 
      with Gen2 devices.
    */
    const switches = buildSwitches(device.ip, status);
    switches.forEach((aSwitch, index) => {
      notifyFullStatus.params[aSwitch.key] = {
        output: aSwitch.output,
        brightness:
          typeof aSwitch.brightness !== "undefined"
            ? aSwitch.brightness
            : undefined,
        white: typeof aSwitch.white !== "undefined" ? aSwitch.white : undefined,
        rgb: typeof aSwitch.rgb !== "undefined" ? aSwitch.rgb : undefined,
        aenergy: {
          by_minute: [
            (status.meters[index].counters[0] * 1000) / 60,
            (status.meters[index].counters[1] * 1000) / 60,
            (status.meters[index].counters[2] * 1000) / 60,
          ],
        },
      };
    });

    // console.log(`GEN1 NotifyFullStatus: ${JSON.stringify(notifyFullStatus)}`);

    return notifyFullStatus;
  }
}

/**
    Create an array of switches from the response of an status request.
    Properties of GEN1 switches are mapped to the corresponding properties of 
    GEN2 switches for compatibility on the client side
    @param {string}  deviceIp The IP of the device the switch belongs to.
    @param {object}  data The result of a status request.
    @return {array} The array with the GEN2 compatible switches.
*/
function buildSwitches(deviceIp, data) {
  let arrOrig = [];
  let type;
  if (typeof data?.lights !== "undefined") {
    // The existence of 'mode' identifies an RGBW2 device
    if (typeof data?.mode === "undefined") {
      type = "light";
    } else {
      type = "color";
    }
    arrOrig = data.lights;
  } else if (typeof data?.relays !== "undefined") {
    type = "relay";
    arrOrig = data.relays;
  }

  const arrSwitches = arrOrig.map((aSwitch, index) => {
    return {
      type,
      deviceIp,
      key: `switch:${index}`,
      id: index,
      output: aSwitch.ison,
      brightness:
        typeof aSwitch.brightness !== "undefined"
          ? aSwitch.brightness
          : aSwitch.gain,
      white: typeof aSwitch.white !== "undefined" ? aSwitch.white : undefined,
      rgb:
        aSwitch.mode === "color"
          ? [aSwitch.red, aSwitch.green, aSwitch.blue]
          : undefined,
    };
  });

  return arrSwitches;
}

/**
  Toggle the switch of a GEN1 device.
  @param {object} aSwitch The switch that must be toggled.
  @param {string} [password] The password that is needed if the Authentication on the device is activated
*/
function toggleSwitch(aSwitch, password) {
  const url = `http://${aSwitch.deviceIp}/${aSwitch.type}/${aSwitch.id}?turn=toggle`;
  shellyAxios.get(url, password).catch((err) => {
    console.error(err.message);
  });
}

/**
  Set values of the switch of a GEN1 device.
  Up to now the following types are supported:
  - 'light' for a light switch
  - 'color' for a color switch
  see https://shelly.guide/webhooks-https-requests/ for details
  @param {object} aSwitch The switch that must be toggled.
  @param {string} [password] The password that is needed if the Authentication on the device is activated
    
*/
function setSwitch(aSwitch, password) {
  let url = "";
  if (aSwitch.type === "light") {
    url = `http://${aSwitch.deviceIp}/${aSwitch.type}/${aSwitch.id}?brightness=${aSwitch.brightness}&white=${aSwitch.white}`;
  } else {
    url = `http://${aSwitch.deviceIp}/${aSwitch.type}/${aSwitch.id}?gain=${aSwitch.brightness}&white=${aSwitch.white}&red=${aSwitch.rgb[0]}&green=${aSwitch.rgb[1]}&blue=${aSwitch.rgb[2]}`;
  }
  shellyAxios.get(url, password).catch((err) => {
    console.error(err.message);
  });
}

/**
  Get the status of a device identified by its IP
  @async
  @param {string} ip The IP used to identify the device
  @param {string} [password] The password that is needed if the Authentication on the device is activated
  @return {Promise<object>} The response object of the status request.
*/
async function getStatus(ip, password) {
  return await shellyAxios.get(`http://${ip}/status`, password).catch((err) => {
    console.error(err.message);
  });
}

/**
  Get the status of a device identified by its IP
  @async
  @param {object} device The device to get the available updates for
  @return {Pomise<object>} The device with the available updates added or an error
*/
async function getAvailableUpdates(device) {
  const res = await shellyAxios
    .get(`http://${device.ip}/ota`, device.password)
    .catch((err) => {
      console.error(err.message);
    });

  if (res.status === 200) {
    console.log("Successfully got the available updates of " + device.cname);
    const ota = res.data;
    device.stable =
      typeof ota.new_version !== "undefined" && ota.has_update
        ? ota.new_version.substring(ota.new_version.indexOf("/") + 1)
        : undefined;
    device.beta =
      typeof ota.beta_version !== "undefined" && ota.beta_version !== ""
        ? ota.beta_version.substring(ota.beta_version.indexOf("/") + 1)
        : undefined;
  } else {
    if (typeof res !== "undefined") {
      console.error(`Could not get available updates of ${device.cname}`);
    }
  }
  return device;
}

/**
  Get a 'NotifyFullStatus' object from the Shelly Gen1 connector and 
  send it to the 'wsHandler' that forwards it to his clients.
  @async
  @param {object} device A Gen1 device that is asked for its status.
*/
async function sendNotifyFullStatus(device) {
  const gen1Status = await getNotifyFullStatus(device);
  wsclient.send(gen1Status);
}

module.exports = {
  createDevice,
  toggleSwitch,
  setSwitch,
  getNotifyFullStatus,
  sendNotifyFullStatus,
  getAvailableUpdates,
};
