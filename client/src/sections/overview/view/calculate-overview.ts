/*
  Author: André Kreienbring
  Check the existance of energy values in the 'NotifyFullStatus' of every device. 
  The values are returned from the 'aenergy.by_minute[0]'
  The 'apower' value of the device could be an alternative.
  A device can have up to 4 switches!

  The total number of script and running scripts is also calculated.
  The total number of devices connected to the cloud is also calculated.
  'powerPerDevice' is an (series) array that will be passed to the consumption chart.
*/
import type { Device, ParamsScript, DashboardValues, DeviceConsumption } from '@src/types/device';

import { getDeviceConsumption } from '@src/utils/device-consumption';

/**
Calculates several values for the Dashboard
@param {Device[]} devices An array with devices
@returns {DashboardValues} An object with the calculated values.
*/
export default function calculateOverview(devices: Device[]): DashboardValues {
  let scriptsCount = 0;
  let scriptsRunning = 0;
  let onlineCount = 0;
  let cloudCount = 0;
  let currentPower = 0;
  let powerPerDevice: { label: string; value: number }[] = [];
  const colorPerDevice: string[] = [];

  let deviceConsumption: DeviceConsumption = {
    hasSwitch: false,
    totalPower: 0,
    powerPerDevice: [],
  };

  Object.values(devices).forEach((device: Device) => {
    const params = device?.notifyFullStatus?.params;
    if (device.online) onlineCount += 1;

    if (typeof params !== 'undefined') {
      /*
      calculate consumption from all switches of a device and add the information to
      the global powerPerDevice array that will be used for the consumption chart.
      */
      deviceConsumption = getDeviceConsumption(device.cname, params);
      if (deviceConsumption.totalPower > 0 && device.chartColor)
        colorPerDevice.push(device.chartColor);

      powerPerDevice = powerPerDevice.concat(deviceConsumption.powerPerDevice);

      currentPower += deviceConsumption.totalPower;

      // check cloud connection
      if (typeof params?.cloud?.connected !== 'undefined') {
        if (params.cloud.connected) cloudCount += 1;
      }

      /*
      check the status of the scripts of the device.
      Get the id from the device script and use the value
      of the last NotifyFullStatus Event
    */
      if (typeof device.scripts !== 'undefined') {
        let currentScript: ParamsScript | undefined;
        Object.values(device.scripts).forEach((script) => {
          currentScript = params[`script:${script.id}`];

          if (currentScript !== undefined) {
            scriptsCount += 1;
            if (currentScript.running) scriptsRunning += 1;
            // set the value on the device
            script.running = currentScript.running;
          }
        });
      }
    }
  });

  return {
    currentPower,
    powerPerDevice,
    colorPerDevice,
    scriptsRunning,
    scriptsCount,
    cloudCount,
    onlineCount,
  };
}
