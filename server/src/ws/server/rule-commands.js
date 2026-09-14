/*  
  Author: André Kreienbring
  Constains command related functions for the rules, e.g. to execute a command.

  The commands correspond to those which are available on the client side when a rule is created.
  When a rule was successfully tested on a given object, the function of the command will be called with the given parameters
*/
const shellyConnector = require("@devices/shellyConnector.js");
const shellyDevices = require("@devices/shellyDevices.js");

module.exports = {
  TurnON: function turnON(deviceId) {
    const device = shellyDevices.findDeviceById(deviceId);
    //currently we trigger all switches of a devise because currently a certain switch can not be selected when the rule is created.
    device.switches.forEach((aSwitch) => {
      aSwitch.output = true;
      shellyConnector.setSwitch(device, aSwitch);
    });
  },
  TurnOFF: function turnOFF(deviceId) {
    const device = shellyDevices.findDeviceById(deviceId);
    device.switches.forEach((aSwitch) => {
      aSwitch.output = false;
      shellyConnector.setSwitch(device, aSwitch);
    });
  },
};
