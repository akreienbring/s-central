/*
  Author: André Kreienbring
  A simple component that displays a BLE event
  Example: motion or door/window events
*/
import type { EventStatus } from '@src/types/device';

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';

import Highlighter from '../highlighter';

interface BLEEventProps {
  elementId: string;
  scrollableElementId: string;
  event: EventStatus;
}

/**
 * Displays a BLE event
  @param {BLEEventProps} props
  @param {string}  props.elementId The Id of the HTML Element that contains the message.
  @param {string} props.scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {Event} props.event The data portion of an event propertyof a 'NotifyEvent' websocket message.
*/
const BLEEvent = ({ elementId, scrollableElementId, event }: BLEEventProps): JSX.Element => {
  const data = event.data;
  if (typeof data?.motion !== 'undefined') {
    // BLU motion event
    return (
      <Highlighter
        key={createUUID()}
        elementId={elementId}
        scrollableElementId={scrollableElementId}
        text={`"motion":${data.motion}`}
      >
        <Iconify
          icon={Number(data.motion) === 1 ? 'material-symbols:directions-walk' : 'fa6-solid:person'}
          sx={{ color: Number(data.motion) === 1 ? 'blue' : 'black' }}
          key={createUUID()}
        />
      </Highlighter>
    );
  }

  // BLU door / window event
  if (typeof data?.window !== 'undefined') {
    if (Number(data.window) === 1) {
      return (
        <Highlighter
          key={createUUID()}
          elementId={elementId}
          scrollableElementId={scrollableElementId}
          text={`"window":${data.window}`}
        >
          <Iconify
            icon="material-symbols:door-open-rounded"
            sx={{ color: 'black' }}
            key={createUUID()}
          />
        </Highlighter>
      );
    }
    return (
      <Iconify
        icon="material-symbols:door-front-rounded"
        sx={{ color: 'black' }}
        key={createUUID()}
      />
    );
  }

  //  BLU button event
  if (typeof data?.button !== 'undefined') {
    switch (Number(data.button)) {
      case 1:
        return <Iconify icon="mdi:number-1-box" sx={{ color: 'blue' }} key={createUUID()} />;
      case 2:
        return <Iconify icon="mdi:number-2-box" sx={{ color: 'blue' }} key={createUUID()} />;
      case 3:
        return <Iconify icon="mdi:number-3-box" sx={{ color: 'blue' }} key={createUUID()} />;
      case 4:
        return <Iconify icon="mdi:number-4-box" sx={{ color: 'blue' }} key={createUUID()} />;
      case 254:
        return <Iconify icon="f7:hand-point-left-fill" sx={{ color: 'blue' }} key={createUUID()} />;
      default:
        return <Iconify icon="f7:hand-point-left-fill" sx={{ color: 'blue' }} key={createUUID()} />;
    }
  }

  // unhandled BLU event
  return <Iconify icon="material-symbols:event-busy" sx={{ color: 'black' }} key={createUUID()} />;
};

export default BLEEvent;
