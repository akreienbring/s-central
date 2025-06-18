import 'src/custom.css';

/*
  Author: André Kreienbring
  Examines the 'events' property of a 'NotifyEvent' websocket message.
  The message was originally sent by the shelly device to the Shellybroker.
  The event can be a BLE event sent by a bluetooth gateway or
  an other type of event like for example a button press...
*/
import PropTypes from 'prop-types';

import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

import BLEEvent from './ble-event';
import ButtonEvent from './button-event';

/**
  @param {array} events mandatory The events sent by on NotifyEvent websocket message
*/
const NotifyEvents = ({ events }) => {
  const elements = events.map((event) => {
    // shelly-blue events
    if (event.event === 'shelly-blu' && typeof event.data !== 'undefined') {
      return <BLEEvent data={event.data} key={createUUID()} />;
    }

    // non BLE Button envents
    const push = ['single_push', 'double_push', 'triple_push', 'long_push'];
    if (push.includes(event.event)) {
      return <ButtonEvent event={event} key={createUUID()} />;
    }

    if (event.event === 'btn_up' || event.event === 'btn_down') {
      // ignore btn_up and btn_down
      return null;
    }

    // restart event
    if (event.event === 'scheduled_restart') {
      return (
        <Iconify icon="solar:restart-square-bold" sx={{ color: 'black' }} key={createUUID()} />
      );
    }

    // unknown type of event
    return <Iconify icon="ic:sharp-help" sx={{ color: 'black' }} key={createUUID()} />;
  });

  if (elements.length > 0) return elements;

  // should not happen because at least 'help' is returned
  return <Iconify icon="mdi:bug" sx={{ color: 'red' }} key={createUUID()} />;
};

export default NotifyEvents;
NotifyEvents.propTypes = {
  events: PropTypes.array.isRequired,
};
