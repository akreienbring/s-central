/*
    Author: André Kreienbring    
    Connects with Shelly Gen1 devices. Devices are considered to be Gen1 if
    the http://[ip]/shelly returns a 'type attribute.
    These devices have various methods to get information from. 
    The data will be mapped to the structur of Gen2/3 objects. This way
    the frontend can apply the same functionality. 
*/
const shellyAxios = require("./shellyAxios.js");

/*
  Used when a device was identified as a Gen1 device.
  Some information is set on the device that is displayed on the frontend. 
  Empty arrays are added. This way the frontend does not need to check for undefined.
  @param {object} device mandatory The device that could not be connectd to or that is not supported
  @param {object} data The result of a http:/[ip]/shelly call. Contains e.g. the type property
  @param {string} clientImagePath The path to the device images on the client side.
  @returns {object} The updated device
*/
async function createGen1Device(device, data, clientImagePath) {
  device.online = true;
  device.name = data.type;
  device.image = `${clientImagePath}${data.type}.png`;
  device.gen = 1;
  device.id = data.type + device.ip;
  device.scripts = [];
  device.kvs = [];
  device.switches = await getSwitches(device);
  device.wsmessages = {};
  return device;
}

/*
  Creates an array with the switches of a Gen1 device.
  'lights' and 'relays' of Gen1 devices are converted to'switch:[X]' where X is the index of the switch.
  @param {object} device mandatory The device to enrich with the array of switches
  @returns {array} The array of switches. The array is empty if the 
  device does have switches.
*/
async function getSwitches(device) {
  console.log("Getting Switches for the device " + device.cname);

  const res = await getStatus(device.ip);
  if (res.status === 200) {
    return buildSwitches(res.data);
  }
  return [];
}

/*
  As Gen1 devices don't send notifications, this functions builds the parts of
  a 'NotifyFullStatus' the client or websocket server need
  - to show the status of switches and 
  - create the power consumption values 
*/
async function getNotifyFullStatus(device) {
  const res = await getStatus(device.ip);
  if (res.status === 200) {
    const status = res.data;

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
          available_updates: status.has_update
            ? {
                stable: {
                  version: status.update.new_version.substring(
                    status.update.new_version.indexOf("/") + 1
                  ),
                },
              }
            : {},
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
    const switches = buildSwitches(status);
    switches.forEach((aSwitch, index) => {
      notifyFullStatus.params[aSwitch.key] = {
        output: aSwitch.output,
        brightness: typeof aSwitch.brightness !== 'undefined' ? aSwitch.brightness : undefined,
        white: typeof aSwitch.white !== 'undefined' ? aSwitch.white : undefined,
        rgb: typeof aSwitch.rgb !== 'undefined' ? aSwitch.rgb : undefined,
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

/*
    Create an array of switches from the response of an status request.
    @param {data}  data The result of a status request.
    @return {array} The array with the GEN2 compatible switches.
*/
function buildSwitches(data) {
  let arrOrig = [];
  let type;
  if (typeof data?.lights !== "undefined") {
    // UNTESTED! The existence of 'mode' identifies an RGBW2 device
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
      type: type,
      key: `switch:${index}`,
      id: index,
      output: aSwitch.ison,
      brightness: typeof aSwitch.brightness !== 'undefined' ? aSwitch.brightness : undefined,
      white: typeof aSwitch.white !== 'undefined' ? aSwitch.white : undefined,
      rgb: typeof aSwitch.rgb !== 'undefined' ? aSwitch.rgb : undefined,
    };
  });

  return arrSwitches;
}

/*
    Toggle the switch of a GEN1 device.
    @param {string} ip The IP of the device
    @param {object} aSwitch The switch that must be toggled.
      aSwitch.type must be: 'light', 'color' or 'relay'
*/
function toggleSwitch(ip, aSwitch) {
  const url = `http://${ip}/${aSwitch.type}/${aSwitch.id}?turn=toggle`;
  shellyAxios.get(url).catch((err) => {
    console.error(err.message);
  });
}

/*
    Set values of the switch of a GEN1 device.
    @param {string} ip The IP of the device
    @param {object} aSwitch The switch that must be toggled.
      aSwitch.type must be: 'light' or 'color'
*/
function setSwitch(ip, aSwitch) {
  const url = `http://${ip}/${aSwitch.type}/${aSwitch.id}?brightness=${aSwitch.brightness}&white=${aSwitch.white}`;
  shellyAxios.get(url).catch((err) => {
    console.error(err.message);
  });
}

/*
    Get the status of a device
*/
async function getStatus(ip) {
  const res = await shellyAxios
    .get(`http://${ip}/status`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return shellyAxios.handleAxiosError(err);
    });
  return res;
}

module.exports = {
  createGen1Device,
  toggleSwitch,
  setSwitch,
  getStatus,
  buildSwitches,
  getNotifyFullStatus,
};
