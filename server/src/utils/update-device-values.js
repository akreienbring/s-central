/*
  Author: André Kreienbring
  Helps wshandler to insert/update values in the database that stores
  consumption values for minute, hour, day, month, year
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

  if (typeof device.switches !== "undefined") {
    let currentSwitch;
    device.switches.forEach((aSwitch, index) => {
      currentSwitch =
        params[`switch:${aSwitch.id}`] || params[`rgbw:${aSwitch.id}`];

      // update the values of the switch if it was not altered manually before
      const doUpdate =
        typeof aSwitch.ts === "undefined" || params.ts * 1000 > aSwitch.ts;
      if (typeof currentSwitch !== "undefined" && doUpdate) {
        aSwitch.output = currentSwitch.output;
        aSwitch.brightness = currentSwitch.brightness;
        aSwitch.white = currentSwitch.white;
        aSwitch.rgb = currentSwitch.rgb;
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

  // console.log(`${device.cname} currently consumes ${currentPower}`);
  if (currentPower > 0) {
    db.updateConsumption(device.id, device.cname, currentPower, params.ts);
  }
}

module.exports = { update };
