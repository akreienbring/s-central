/*
  Author: André Kreienbring
  Updates device values from a received websocket message
*/
import isEqual from 'lodash/isEqual';

/**
  Checks a 'NotifyFullStatus' websocket message for changes that must be
  applied to a device. (Script and Switch status);
  @param {object} device That is evtl. changed by the data of the message.
  @param {object} params The 'params' object of a 'NotifyFullStatus' message.
  @return {object} The device if the device was changed. If it was not changed null is returned.
*/
export default function updateDeviceValues(device, params) {
  let isChanged = !device.online; // the device is obviosly online

  if (typeof device.scripts !== 'undefined') {
    /*
      check the status of the scripts of the device.
      Get the id from the device script and use the value
      of the last NotifyFullStatus Event
    */
    let currentScript;
    Object.values(device.scripts).forEach((script) => {
      currentScript = params[`script:${script.id}`];

      if (script.running !== currentScript.running) {
        isChanged = true;
        script.running = currentScript.running;
      }
    });
  }

  /*
    check the status of the switches of the device.
    Get the id from the device switch and use the value
    of the last NotifyFullStatus Event ONLY if the timestamp is 
    younger than the last manual switching.
  */
  if (typeof device.switches !== 'undefined') {
    let currentSwitch;
    device.switches.forEach((aSwitch) => {
      currentSwitch = params[`switch:${aSwitch.id}`] || params[`rgbw:${aSwitch.id}`];

      // update the values of the switch if it was not altered before
      const doUpdate = typeof aSwitch.ts === 'undefined' || params.ts * 1000 > aSwitch.ts;
      if (typeof currentSwitch !== 'undefined' && doUpdate) {
        if (aSwitch.output !== currentSwitch.output) {
          isChanged = true;
          aSwitch.output = currentSwitch.output;
          console.log(
            `Switch ${aSwitch.key} of device ${device.cname} output was set to ${aSwitch.output}`
          );
        }
        if (aSwitch.brightness !== currentSwitch.brightness) {
          isChanged = true;
          aSwitch.brightness = currentSwitch.brightness;
          console.log(
            `Switch ${aSwitch.key} of device ${device.cname} brightness was set to ${aSwitch.brightness}`
          );
        }
        if (aSwitch.white !== currentSwitch.white) {
          isChanged = true;
          aSwitch.white = currentSwitch.white;
          console.log(
            `Switch ${aSwitch.key} of device ${device.cname} white was set to ${aSwitch.white}`
          );
        }
        if (!isEqual(aSwitch.rgb, currentSwitch.rgb)) {
          isChanged = true;
          aSwitch.rgb = currentSwitch.rgb;
          console.log(
            `Switch ${aSwitch.key} of device ${device.cname} rgb was set to ${aSwitch.rgb}`
          );
        }
      }
    });
  }

  return isChanged ? { ...device } : null;
}
