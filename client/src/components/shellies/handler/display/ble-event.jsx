/*
  Author: André Kreienbring
  A simple component that displays a BLE event
  Example: motion or door/window events
*/
import PropTypes from 'prop-types';

import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

/**
  @param {object} data The data portion of an event property
    of a 'NotifyEvent' websocket message.
*/
const BLEEvent = ({ data }) => {
  if (typeof data.motion !== 'undefined') {
    // BLU motion event
    return (
      <Iconify
        icon={Number(data.motion) === 1 ? 'material-symbols:directions-walk' : 'fa6-solid:person'}
        sx={{ color: Number(data.motion) === 1 ? 'blue' : 'black' }}
        key={createUUID()}
      />
    );
  }

  // BLU door / window event
  if (typeof data.window !== 'undefined') {
    if (Number(data.window) === 1) {
      return (
        <Iconify
          icon="material-symbols:door-open-rounded"
          sx={{ color: 'black' }}
          key={createUUID()}
        />
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
  if (typeof data.button !== 'undefined') {
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

BLEEvent.propTypes = {
  data: PropTypes.object.isRequired,
};
