/*
  Author: André Kreienbring
  Examines 'NotifyFullStatus', 'NotifyStatus' and 'NotifyEvent'
  websocket messages on a device object.
  The message was originally sent by a shelly device to the Shellybroker.
  This component displays message properties that Shelly device promote as HTML
  Example: System values or cloud status

*/
// see https://icon-sets.iconify.design/?category=General
import type {
  Params,
  NotifyEvent,
  NotifyStatus,
  NotifyFullStatus,
  DeviceConsumption,
} from '@src/types/device';

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';
import { getDeviceConsumption } from '@src/utils/device-consumption';

import White from './display/white';
import Events from './display/events';
import Energy from './display/energy';
import Matter from './display/matter';
import Scripts from './display/scripts';
import Highlighter from './highlighter';
import Firmware from './display/firmware';
import Brightness from './display/brightness';
import SystemValues from './display/systemvalues';

interface NotificationsProps {
  deviceName: string;
  wsMessage: NotifyFullStatus | NotifyStatus | NotifyEvent | undefined;
  elementId: string;
  scrollableElementId: string;
  index: number;
}

/**
  Display the WS messages as Icons and values. 
  To implement highlighting and scolling deviceId and index are used to identify HTML Elements
  @param {string} deviceName The name of the device that sent the message
  @param {WsMessage} wsMessage A websocket message from the wsmessages array of the device.
  @param {string}  elementId The Id of the HTML Element that contains the message.
  @param {string} scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @returns {JSX.Element[]} An array of JSX elements that represent the properties of the message.
*/
const Notifications = ({
  deviceName,
  wsMessage,
  elementId,
  scrollableElementId,
}: NotificationsProps): JSX.Element[] => {
  if (!wsMessage?.params) return [];

  const params: Params = wsMessage.params;

  const elements = [];

  if (wsMessage.method === 'NotifyEvent') {
    // Create HTML from NotifyEvent
    if (typeof params?.events !== 'undefined') {
      elements.push(
        <Events
          elementId={elementId}
          scrollableElementId={scrollableElementId}
          events={params.events}
          key={createUUID()}
        />
      );
    }
  } else {
    const deviceConsumption: DeviceConsumption = getDeviceConsumption(deviceName, params);

    if (wsMessage.method === 'NotifyFullStatus') {
      // Create HTML from NotifyFullStatus
      if (typeof params?.ws?.connected !== 'undefined') {
        elements.push(
          <Highlighter
            key={createUUID()}
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            text={`"ws":{"connected":${params.ws.connected ? 'true' : 'false'}`}
          >
            <Iconify
              icon={
                params.ws.connected ? 'carbon:connection-signal' : 'carbon:connection-signal-off'
              }
              sx={{ color: params.ws.connected ? 'green' : 'red' }}
              key={createUUID()}
            />
          </Highlighter>
        );
      }
      if (typeof params?.sys !== 'undefined') {
        elements.push(
          <SystemValues
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            sys={params.sys}
            key={createUUID()}
          />
        );
      }
      if (typeof params?.cloud?.connected !== 'undefined') {
        elements.push(
          <Highlighter
            key={createUUID()}
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            text={`"cloud":{"connected":${params.cloud.connected ? 'true' : 'false'}}`}
          >
            <Iconify
              icon="material-symbols-light:cloud"
              sx={{ color: params.cloud.connected ? 'green' : 'black' }}
              key={createUUID()}
            />
          </Highlighter>
        );
      }
      if (typeof params?.sys?.available_updates?.stable?.version !== 'undefined') {
        elements.push(
          <Firmware
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            version={params.sys.available_updates.stable.version}
            key={createUUID()}
          />
        );
      }
      elements.push(
        <Scripts
          elementId={elementId}
          scrollableElementId={scrollableElementId}
          params={wsMessage.params}
          key={createUUID()}
        />
      );

      if (deviceConsumption.hasSwitch)
        elements.push(
          <Energy
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            consumption={deviceConsumption.totalPower}
            key={createUUID()}
          />
        );

      if (typeof params['rgbw:0']?.brightness !== 'undefined') {
        elements.push(
          <Brightness
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            brightness={params['rgbw:0'].brightness}
            key={createUUID()}
          />
        );
      }
      if (typeof params['switch:0']?.brightness !== 'undefined') {
        elements.push(
          <Brightness
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            brightness={params['switch:0'].brightness}
            key={createUUID()}
          />
        );
      }
      if (typeof params['rgbw:0']?.white !== 'undefined') {
        elements.push(
          <White
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            white={params['rgbw:0'].white}
            key={createUUID()}
          />
        );
      }
      if (typeof params['switch:0']?.white !== 'undefined') {
        elements.push(
          <White
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            white={params['switch:0'].white}
            key={createUUID()}
          />
        );
      }
      if (typeof params['rgbw:0']?.rgb !== 'undefined') {
        // rgb is an array with 3 values
        const { rgb } = params['rgbw:0'];
        const rgbcss = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        elements.push(
          <Highlighter
            key={createUUID()}
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            text={`,"rgb":\\[${rgb[0]},${rgb[1]},${rgb[2]}\\]`}
          >
            <Iconify icon="material-symbols:light-mode" sx={{ color: rgbcss }} key={createUUID()} />
          </Highlighter>
        );
      }
      if (typeof params?.mqtt?.connected !== 'undefined') {
        elements.push(
          <Highlighter
            key={createUUID()}
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            text={`"mqtt":{"connected":${params.mqtt?.connected ? 'true' : 'false'}}`}
          >
            <Iconify
              icon="cbi:mqtt"
              sx={{ color: params.mqtt.connected ? 'green' : 'red' }}
              key={createUUID()}
            />
          </Highlighter>
        );
      }
      if (typeof params?.matter?.num_fabrics !== 'undefined') {
        elements.push(
          <Matter
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            params={params}
            key={createUUID()}
          />
        );
      }
    } else if (wsMessage.method === 'NotifyStatus') {
      if (deviceConsumption.hasSwitch)
        elements.push(
          <Energy
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            consumption={deviceConsumption.totalPower}
            key={createUUID()}
          />
        );
      /*
          NotifiStatus sends script start / stop info without the id of the script. Therfore its currently useless.
          {"src":"shelly1pmminig3-dcda0cb98f3c","dst":"ws","method":"NotifyStatus","params":{"ts":1773992981.48,"script:2":{"error_msg":null,"errors":[],"running":true}}}
          {"src":"shelly1pmminig3-dcda0cb98f3c","dst":"ws","method":"NotifyStatus","params":{"ts":1774080510.65,"script:3":{"error_msg":"Uncaught TypeError: Assignment to a constant\n at x = 2\n ^\nin function called from system\n\n","errors":["type_error"],"running":false}}}        
          {"src":"shellyplusrgbwpm-30c922584d48","dst":"ws","method":"NotifyStatus","params":{"ts":1774159981.21,"sys":{"available_updates":{"stable":{"version":"1.7.4"}}}}}
          {"src":"shellyplusrgbwpm-30c92257d20c","dst":"ws","method":"NotifyStatus","params":{"ts":1774251322.24,"cloud":{"connected":true}}}        */
    } else {
      // method not supported
      elements.push(<Iconify icon="ic:sharp-help" sx={{ color: 'black' }} key={createUUID()} />);
    }
  }

  return elements;
};

export default Notifications;
