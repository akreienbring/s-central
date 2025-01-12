/*
  Author: André Kreienbring
  A simple component that display an (non-BLE) event.
  Example: button press event
*/
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

/*
  @param {object} event mandatory The event
    of a 'NotifyEvent' websocket message.
*/
const ButtonEvent = ({ event }) => {
  let degree;
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
    </Stack>
  );
};

export default ButtonEvent;

ButtonEvent.propTypes = {
  event: PropTypes.object.isRequired,
};
