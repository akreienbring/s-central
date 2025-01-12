/*
    Author: André Kreienbring
*/

/*
  Calculates the consumption from all the switches of a notification message.
  The websocket msg 'Notify(Full)Status' may contain up to four switches or an 'rgbw' switch.
  The given 'params' part of a 'Notify(Full)Status' is queried for this data.
  @param {string} deviceName The custom name of the device that will be shown as switch name
  @param {object} params The params part of a 'Notify(Full)Status' websocket message
  @return {object} The current status / consumption of all switches as mw/m. Where:
      - hasSwitch {boolean} True, if the device has at least one switch
      - totalPower {number} The total consumption of the device
      - powerPerDevice {array} The consumption per switch. (for usage in a chart)
      - colorPerDevice {array} The color for usage in a chart
*/
export function getDeviceConsumption(deviceName, params) {
  let currentSwitch;
  let totalPower = 0;
  let hasSwitch = false;
  const powerPerDevice = [];

  // check for up to four switches
  for (let i = 0; i <= 3; i += 1) {
    // NotifyStatus constains either aenergy OR apower
    currentSwitch = params[`switch:${i}`];

    if (typeof currentSwitch?.aenergy?.by_minute !== 'undefined') {
      // aenergy returns the power in mw/m
      hasSwitch = true;
      const devicePower = Number(currentSwitch.aenergy.by_minute[0]);
      if (devicePower > 0) {
        totalPower += devicePower;
        powerPerDevice.push({
          label: `${deviceName} switch:${i}`,
          value: devicePower,
        });
      }
    }
  } // switches 0-3

  // check for rgbw:0 switch
  currentSwitch = params['rgbw:0'];

  if (typeof currentSwitch?.aenergy?.by_minute !== 'undefined') {
    hasSwitch = true;
    const devicePower = Number(currentSwitch.aenergy.by_minute[0]);
    if (devicePower > 0) {
      totalPower += devicePower;
      powerPerDevice.push({ label: `${deviceName} rgbw:0`, value: devicePower });
    }
  }

  return { hasSwitch, totalPower, powerPerDevice };
}
