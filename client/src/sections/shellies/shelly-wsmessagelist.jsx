/*
  Author: André Kreienbring
  Builds the list of wsmessages of a device shown besides a ShellyCard component.
  
*/
import { Fragment } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';

import Notifications from './handler/notifcations';
import SystemTime from './handler/display/systemtime';

/**
  The 'wsmessages' object of a device has up to 3 keys (depends on the device)
  - NotifyFullStatus
  - NotifyStatus
  - NotifyEvent
  This components presents extracted values (with icons) from the raw JSON message that was received.

  @param {string} deviceName mandatory The name of the device to 
    determine the handler of the wsmessages
  @param {object} wsmessages mandatory The last websocket messages that were send from the shelly device
    The key in the the object is the 'method' of the ws message. (NotifyFullStatus, NotifyStatus, NotifyEvent)
*/
const WSMessageList = ({ deviceName, wsmessages }) => {
  if (typeof wsmessages === 'undefined') return null;

  const elements = Object.keys(wsmessages).map((key) => {
    const wsMessage = wsmessages[key];

    return (
      <Fragment key={createUUID()}>
        <Stack
          direction="row"
          justifyContent="left"
          alignItems="center"
          spacing={2}
          key={createUUID()}
        >
          {typeof wsMessage?.params?.ts !== 'undefined' && (
            <SystemTime ts={wsMessage.params.ts} key={createUUID()} />
          )}
          <Typography variant="subtitle2" key={createUUID()}>
            {key}
          </Typography>
          <Notifications deviceName={deviceName} wsMessage={wsMessage} key={createUUID()} />
        </Stack>
        <Typography variant="caption" key={createUUID()}>
          {JSON.stringify(wsMessage)}
        </Typography>
      </Fragment>
    );
  });

  return elements;
};

export default WSMessageList;
