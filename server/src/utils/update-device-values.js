/*
  Author: André Kreienbring
  Checks a 'NotifyFullStatus' websocket message for changes that must be
  applied to a device. (Script and Switch status).
  Updates the consumption values in the database.
*/
const db = require("@db/db.js");

/**
  Called by wshandler if a 'NotifyFullStatus' from a Shelly device arrives
  that contains data regarding the switches.
  The consumption is calculated and then written to the database as mw/m.
  The current state of the switches of the device is updated on the device.
  @param {object} device The device that send the websocket message.
  @param {object} params The params of the websocket message 'NotifyFullStatus'.
*/
function update(device, params) {
  let currentPower = 0;

  if (typeof device.scripts !== "undefined") {
    /*
      check the status of the scripts of the device.
      Get the id from the device script and use the value
      of the last NotifyFullStatus Event
    */
    let currentScript;
    Object.values(device.scripts).forEach((script) => {
      currentScript = params[`script:${script.id}`];
      script.running = currentScript.running;
    });
  }

  if (typeof device.switches !== "undefined") {
    let currentSwitch;
    device.switches.forEach((aSwitch) => {
      currentSwitch =
        params[`switch:${aSwitch.id}`] || params[`rgbw:${aSwitch.id}`];

      // update the values of the switch if it was not altered manually before
      // A difference of more than 2 seconds is considered a manual change
      const doUpdate =
        typeof aSwitch.ts === "undefined" || params.ts - aSwitch.ts > 2;
      if (typeof currentSwitch !== "undefined" && doUpdate) {
        aSwitch.output = currentSwitch.output;
        aSwitch.brightness = currentSwitch.brightness;
        aSwitch.white = currentSwitch.white;
        aSwitch.rgb = currentSwitch.rgb;
      } else {
        console.warn(
          `Skipping update of switch ${aSwitch.id} of device ${device.cname} to prevent overwrite of manual changes.`
        );
      }

      // count the current power consumption (per device NOT per switch)
      if (typeof currentSwitch?.aenergy?.by_minute !== "undefined") {
        // aenergy returns the power in mw/m
        const switchPower = Number(currentSwitch.aenergy.by_minute[0]);
        if (switchPower > 0) {
          currentPower += switchPower;
        }
      }
    });
  }

  if (currentPower > 0) {
    // update consumption values for minute, hour, day, month, year
    db.updateConsumption(device.id, device.cname, currentPower, params.ts);
  }
}

module.exports = { update };
