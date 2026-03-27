/*
  Author: André Kreienbring
  Updates the consumption values in the database.
*/
const db = require("@db/db.js");

function update(device, params) {
  let currentPower = 0;

  if (typeof device.switches !== "undefined") {
    let currentSwitch;
    device.switches.forEach((aSwitch) => {
      currentSwitch =
        params[`switch:${aSwitch.id}`] || params[`rgbw:${aSwitch.id}`];

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
