/*
  Author: André Kreienbring
  Updates device values from a received websocket message
*/
import type {
  Device,
  Params,
  DeviceSwitch,
  ParamsScript,
  ParamsSwitch,
  DeviceNotifyMessages,
} from '@src/types/device';

import isEqual from 'lodash/isEqual';
import { publishEvent } from '@src/events/pubsub';

/**
  Checks a 'NotifyFullStatus' or 'NotifyStatus' websocket message for changes that must be
  applied to a device. (Script and Switch status);
  If the device is a Gen2+ device, the NotifyStatus is send directly when the script or switch was changed.
  This has the advantage, that there are no sync problems like when using the NotifyFullStatus, that is send every minute.
  Gen1 devices don't send a NotifiyStatus message. Hence timestamps are used to prevent race problems.
  @param {object} device The device that is evtl. changed by the data of the message.
  @param {object} wsmessages The ws messages of the device. May contain the 'params' object of a 'NotifyFullStatus' or a 'NotifyStatus' message.
  @return {object} The device if the device was changed. If it was not changed null is returned.
*/
export default function updateDeviceValues(
  device: Device,
  wsmessages: DeviceNotifyMessages
): Device | null {
  let isChanged = !device.online;

  const params: Params | undefined = wsmessages?.notifyStatus?.params;
  const fullparams: Params | undefined = wsmessages?.notifyFullStatus?.params;

  if ((typeof fullparams !== 'undefined' && device.gen === 1) || device.gen >= 2) {
    let finalParams: Params | undefined;
    // use newest NotifyStatus OR NotifyFullStatus for Gen2+ and NotifiyFullstatus for Gen1
    if (device.gen === 1) {
      finalParams = fullparams;
    } else {
      if (params && fullparams) {
        finalParams = params.ts > fullparams.ts ? params : fullparams;
      } else {
        finalParams = params || fullparams;
      }
    }

    if (finalParams && device.scripts.length > 0) {
      /*
      check the status of the scripts of the device.
      Get the id from the device script and use the value
      of the last NotifyFullStatus Event
    */
      let currentScript: ParamsScript | undefined;
      Object.values(device.scripts).forEach((script) => {
        currentScript = finalParams[`script:${script.id}`];

        if (
          typeof currentScript?.running !== 'undefined' &&
          script.running !== currentScript.running
        ) {
          isChanged = true;
          script.running = currentScript.running;
          console.log(
            `Script ${script.name} of device ${device.cname} running was set to ${script.running}`
          );
        }
      });
    }

    if (finalParams && device.switches.length > 0) {
      /*
        check the status of the switches of the device.
        Get the id from the device switch and use the value
        of the last NotifyFullStatus Event ONLY if the timestamp is 
        younger than the last manual switching.
      */
      let currentSwitch: ParamsSwitch | undefined;
      let isSwitchChanged = false;
      device.switches.forEach((aSwitch: DeviceSwitch) => {
        currentSwitch = finalParams[`switch:${aSwitch.id}`] || finalParams[`rgbw:${aSwitch.id}`];

        // update the values of the switch if it was not altered before
        // A difference of 2 seconds is considered as a manual change
        const doUpdate =
          device.gen >= 2
            ? true
            : typeof aSwitch.ts === 'undefined' || finalParams.ts - aSwitch.ts > 2;
        if (doUpdate) {
          if (
            typeof currentSwitch?.output !== 'undefined' &&
            aSwitch.output !== currentSwitch.output
          ) {
            isSwitchChanged = true;
            aSwitch.output = currentSwitch.output;
            console.log(
              `Switch ${aSwitch.key} of device ${device.cname} output was set to ${aSwitch.output}`
            );
          }
          if (
            typeof currentSwitch?.brightness !== 'undefined' &&
            aSwitch.brightness !== currentSwitch.brightness
          ) {
            isSwitchChanged = true;
            aSwitch.brightness = currentSwitch.brightness;
            console.log(
              `Switch ${aSwitch.key} of device ${device.cname} brightness was set to ${aSwitch.brightness}`
            );
          }
          if (
            typeof currentSwitch?.white !== 'undefined' &&
            aSwitch.white !== currentSwitch.white
          ) {
            isSwitchChanged = true;
            aSwitch.white = currentSwitch.white;
            console.log(
              `Switch ${aSwitch.key} of device ${device.cname} white was set to ${aSwitch.white}`
            );
          }
          if (
            typeof currentSwitch?.rgb !== 'undefined' &&
            !isEqual(aSwitch.rgb, currentSwitch.rgb)
          ) {
            isSwitchChanged = true;
            aSwitch.rgb = currentSwitch.rgb;
            console.log(
              `Switch ${aSwitch.key} of device ${device.cname} rgb was set to ${aSwitch.rgb}`
            );
          }
        }
      });

      /*
        If any of the switches of the devices was changed, this event will be
        received by ShellyScenes to eventually update a selected scene. 
      */
      if (isSwitchChanged) publishEvent('switchChanged', device.id);
      isChanged = isChanged || isSwitchChanged;
    }
  }

  if (isChanged) {
    device.scripts = [...device.scripts];
    device.switches = [...device.switches];
  }

  if (typeof fullparams?.sys?.available_updates !== 'undefined') {
    if (device.stable !== fullparams.sys.available_updates?.stable?.version) {
      device.stable = fullparams.sys.available_updates?.stable?.version;
      console.log(`Device stable was set to ${device.stable}`);
      isChanged = true;
    }
    if (device.beta !== fullparams.sys.available_updates?.beta?.version) {
      device.beta = fullparams.sys.available_updates?.beta?.version;
      console.log(`Device beta was set to ${device.beta}`);
      isChanged = true;
    }
  }

  return isChanged ? { ...device } : null;
}
