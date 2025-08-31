/*
  Author: André Kreienbring
  Examines 'NotifyFullStatus', 'NotifyStatus' and 'NotifyEvent'
  websocket messages on a device object.
  The message was originally sent by a shelly device to the Shellybroker.
  This component displays message properties that Shelly devicec promote as HTML
  Example: System values or cloud status

*/
// see https://icon-sets.iconify.design/?category=General

import { createUUID } from 'src/utils/general';
import { getDeviceConsumption } from 'src/utils/device-consumption';

import Iconify from 'src/components/iconify';

import White from './display/white';
import Events from './display/events';
import Energy from './display/energy';
import Scripts from './display/scripts';
import Firmware from './display/firmware';
import Brightness from './display/brightness';
import SystemValues from './display/systemvalues';

/**
  Display the WS messages
  @param {object} deviceName The name of the device that sent the message
  @param {object} wsMessage A websocket message from the 
    wsmessages array of the device.
*/
const Notifications = ({ deviceName, wsMessage }) => {
  const { params } = wsMessage;
  if (typeof params === 'undefined') return [];

  const elements = [];
  let deviceConsumption;

  if (wsMessage.method !== 'NotifyEvent')
    deviceConsumption = getDeviceConsumption(deviceName, params);

  if (wsMessage.method === 'NotifyFullStatus') {
    // Create HTML from NotifyFullStatus
    if (typeof params?.sys !== 'undefined') {
      elements.push(<SystemValues sys={params.sys} key={createUUID()} />);
    }
    if (typeof params?.cloud?.connected !== 'undefined') {
      elements.push(
        <Iconify
          icon="material-symbols-light:cloud"
          sx={{ color: params.cloud.connected ? 'green' : 'black' }}
          key={createUUID()}
        />
      );
    }
    if (typeof params?.sys?.available_updates?.stable?.version !== 'undefined') {
      elements.push(
        <Firmware version={params.sys.available_updates.stable.version} key={createUUID()} />
      );
    }
    elements.push(<Scripts params={wsMessage.params} key={createUUID()} />);

    if (deviceConsumption.hasSwitch)
      elements.push(<Energy consume={deviceConsumption.totalPower} key={createUUID()} />);

    if (typeof params['rgbw:0']?.brightness !== 'undefined') {
      elements.push(<Brightness brightness={params['rgbw:0'].brightness} key={createUUID()} />);
    }
    if (typeof params['switch:0']?.brightness !== 'undefined') {
      elements.push(<Brightness brightness={params['switch:0'].brightness} key={createUUID()} />);
    }
    if (typeof params['rgbw:0']?.white !== 'undefined') {
      elements.push(<White white={params['rgbw:0'].white} key={createUUID()} />);
    }
    if (typeof params['switch:0']?.white !== 'undefined') {
      elements.push(<White white={params['switch:0'].white} key={createUUID()} />);
    }
    if (typeof params['rgbw:0']?.rgb !== 'undefined') {
      // rgb is an array with 3 values
      const { rgb } = params['rgbw:0'];
      const rgbcss = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      elements.push(
        <Iconify icon="material-symbols:light-mode" sx={{ color: rgbcss }} key={createUUID()} />
      );
    }
  } else if (wsMessage.method === 'NotifyStatus') {
    // Create HTML from NotifyStatus
    if (deviceConsumption.hasSwitch)
      elements.push(<Energy consume={deviceConsumption.totalPower} key={createUUID()} />);
  } else if (wsMessage.method === 'NotifyEvent') {
    // Create HTML from NotifyEvent
    if (typeof params?.events !== 'undefined') {
      elements.push(<Events events={params.events} key={createUUID()} />);
    }
  } else {
    // method not supported
    elements.push(<Iconify icon="ic:sharp-help" sx={{ color: 'black' }} key={createUUID()} />);
  }

  return elements;
};

export default Notifications;
