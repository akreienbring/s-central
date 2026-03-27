/*
  Author: André Kreienbring
  A device must be reloaded (Request information from the device) in certain situations: 
  - it's unknown (did not respond to the initial /shelly request)
  - stable or beta firmware information has changed
  - a firmware update was triggered / is pending
*/

const shellyDevices = require("@devices/shellyDevices.js");

/**
 * Checks if a device must be reloaded. Only requested NotifyFullStatus messages are relevant for this check.
 * @async
 * @param {object} device The device to check
 * @param {object} msg The message that was received from the device
 * @returns {Promise<object>} If the message is a NotifyFullStatus and the device was reloaded, the reloaded device is returned.
 * In all other cases null is returned.
 */
async function check(device, msg) {
  if (msg.method === "NotifyFullStatus" && msg.dst === "request") {
    const newStable = msg.params.sys.available_updates?.stable?.version;
    const newBeta = msg.params.sys.available_updates?.beta?.version;

    if (
      device.name === "unknown" ||
      device.stable !== newStable ||
      device.beta !== newBeta ||
      (typeof device.updateStablePending !== "undefined" &&
        device.updateStablePending) ||
      (typeof device.updateBetaPending !== "undefined" &&
        device.updateBetaPending)
    ) {
      /*
        Reload an offline device because it's obviously online.
        If an update is pending, the device will be reloaded
        to get the current firmware of the device.
        If stable or beta update has changed, the device was updated outside of this app.
      */
      if (device.name === "unknown")
        console.log(`Device ${device.cname} is unknown. Reloading...`);
      if (
        (typeof newStable !== "undefined" && device.stable !== newStable) ||
        (typeof newBeta !== "undefined" && device.beta !== newBeta)
      )
        console.log(
          `Device ${device.cname} available firmware info changed. Reloading...`,
        );
      if (
        typeof device.updateStablePending !== "undefined" &&
        device.updateStablePending
      )
        console.log(
          `Device ${device.cname} stable update is pending. Reloading...`,
        );
      if (
        typeof device.updateBetaPending !== "undefined" &&
        device.updateBetaPending
      )
        console.log(
          `Device ${device.cname} beta update is pending. Reloading...`,
        );

      return shellyDevices.getDevice(device.ip, true).then((reloadedDevice) => {
        // prettyjson.render(reloadedDevice);
        if (device.updateStablePending || device.updateBetaPending) {
          reloadedDevice.reloads++;
          if (
            reloadedDevice.fw_id === device.old_fw_id &&
            device.reloads <= 5
          ) {
            console.warn(
              `Reloaded device ${reloadedDevice.cname} ${device.reloads} time(s). Firmware is still the same (${device.fw_id}).`,
            );
          } else {
            if (device.reloads <= 5) {
              console.log(
                `Firmware update of ${device.cname} was successfull!`,
              );
            } else {
              console.warn(
                `Firmware update of ${device.cname} was NOT successfull!`,
              );
            }
            delete device.updateBetaPending;
            delete device.updateStablePending;
            delete device.old_fw_id;
            delete device.reloads;
          }
        }

        return reloadedDevice;
      }); //Reload done
    } // needs Reload
  } // is NotifyFullStatus

  return Promise.resolve(null);
}

module.exports = { check };
