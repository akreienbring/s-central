/*
  Author: André Kreienbring
  Examines the 'events' property of a 'NotifyEvent' websocket message.
  The message was originally sent by the shelly device to the Shellybroker.
  The event can be a BLE event sent by a bluetooth gateway or
  an other type of event like for example a button press...
*/
import '@src/custom.css';

import type { EventStatus } from '@src/types/device';

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';

import BLEEvent from './ble-event';
import ButtonEvent from './button-event';
import Highlighter from '../highlighter';

interface NotifyEventsProps {
  elementId: string;
  scrollableElementId: string;
  events: EventStatus[];
}

/**
 * Displays the NotifyEvent events as icons
  @param {NotifyEventsProps} props
  @param {string}  props.elementId The Id of the HTML Element that contains the message.
  @param {string} props.scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {EventStatus[]} props.events The events sent by on NotifyEvent websocket message
  @returns {JSX.Element} HTML elements representing the events
*/
const NotifyEvents = ({
  elementId,
  scrollableElementId,
  events,
}: NotifyEventsProps): JSX.Element[] => {
  const push = ['single_push', 'double_push', 'triple_push', 'long_push'];
  const elements = events.map((event) => {
    // shelly-blue events
    if (event.event === 'shelly-blu' && typeof event.data !== 'undefined') {
      return (
        <BLEEvent
          elementId={elementId}
          scrollableElementId={scrollableElementId}
          event={event}
          key={createUUID()}
        />
      );
    }

    // non BLE Button envents
    if (push.includes(event.event)) {
      return (
        <ButtonEvent
          elementId={elementId}
          scrollableElementId={scrollableElementId}
          event={event}
          key={createUUID()}
        />
      );
    }

    if (event.event === 'btn_up' || event.event === 'btn_down') {
      // ignore btn_up and btn_down for the time being
      // return null;
    }

    // restart event
    if (event.event === 'scheduled_restart') {
      return (
        <Highlighter
          key={createUUID()}
          elementId={elementId}
          scrollableElementId={scrollableElementId}
          text='"event":"scheduled_restart"'
        >
          <Iconify icon="solar:restart-square-bold" sx={{ color: 'black' }} key={createUUID()} />
        </Highlighter>
      );
    }

    // unknown type of event
    return <Iconify icon="ic:sharp-help" sx={{ color: 'black' }} key={createUUID()} />;
  });

  if (elements.length > 0) {
    return elements;
  } else {
    return [<Iconify icon="mdi:bug" sx={{ color: 'red' }} key={createUUID()} />];
  }
};

export default NotifyEvents;
