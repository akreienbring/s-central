/*
  Author: André Kreienbring
  A simple component that display an (non-BLE) event.
  Example: button press event
*/
import type { EventStatus } from '@src/types/device';

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';

import Stack from '@mui/material/Stack';

import Highlighter from '../highlighter';

interface ButtonEventProps {
  elementId: string;
  scrollableElementId: string;
  event: EventStatus;
}

/**
  Displays the kind of button event as icon
  @param {ButtonEventProps} props
  @param {string} props.elementId The Id of the HTML Element that contains the message.
  @param {string} props.scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {EventStatus} props.event The event of a 'NotifyEvent' websocket message.
*/
const ButtonEvent = ({ elementId, scrollableElementId, event }: ButtonEventProps): JSX.Element => {
  let degree: number;
  switch (Number(event.id)) {
    case 0:
      degree = 180;
      break;
    case 1:
      degree = 270;
      break;
    case 2:
      degree = 90;
      break;
    default:
      degree = 0;
  }
  return (
    <Stack direction="row" key={createUUID()}>
      <Highlighter
        key={createUUID()}
        elementId={elementId}
        scrollableElementId={scrollableElementId}
        text={`"event":"${event.event}"`}
      >
        <Iconify
          icon="system-uicons:grid-squares-add"
          sx={{ color: 'black' }}
          className={`rotate${degree}`}
          key={createUUID()}
        />
        {event.event === 'single_push' && (
          <Iconify icon="mdi:number-1-box" sx={{ color: 'blue' }} key={createUUID()} />
        )}
        {event.event === 'double_push' && (
          <Iconify icon="mdi:number-2-box" sx={{ color: 'blue' }} key={createUUID()} />
        )}
        {event.event === 'triple_push' && (
          <Iconify icon="mdi:number-3-box" sx={{ color: 'blue' }} key={createUUID()} />
        )}
        {(event.event === 'long_push' || event.event === 'btn_up') && (
          <Iconify icon="f7:hand-point-left-fill" sx={{ color: 'blue' }} key={createUUID()} />
        )}
      </Highlighter>
    </Stack>
  );
};

export default ButtonEvent;
