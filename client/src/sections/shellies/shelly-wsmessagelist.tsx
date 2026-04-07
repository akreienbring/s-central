/*
  Author: André Kreienbring
  Builds the list of wsmessages of a device shown in a ShellyCard component.
  
*/
import type { DeviceNotifyMessages } from '@src/types/device';

import { type JSX, Fragment } from 'react';
import { createUUID } from '@src/utils/general';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Notifications from './handler/notifcations';
import SystemTime from './handler/display/systemtime';

interface WSMessageListProps {
  deviceId: string;
  deviceName: string;
  wsMessages: DeviceNotifyMessages;
}

/**
  The 'wsmessages' object of a device has up to 3 keys (depends on the device)
  - NotifyFullStatus
  - NotifyStatus
  - NotifyEvent
  This components presents extracted values (with icons) from the raw JSON message that was received.
  @param {WSMessageListProps} props
  @param {string} props.deviceId  The Id of the device used for highligthing text
  @param {string} props.deviceName  The name of the device used to calculate the consumption
  @param {DeviceNotifyMessages} props.wsMessages  The last websocket messages that were send from the shelly device
    The key in the the object is the 'method' of the ws message. (NotifyFullStatus, NotifyStatus, NotifyEvent)
  @returns {JSX.Element[]} A list of wsmessages with extracted values and icons.
*/
const WSMessageList = ({
  deviceId,
  deviceName,
  wsMessages,
}: WSMessageListProps): JSX.Element[] | null => {
  if (typeof wsMessages === 'undefined') return null;

  const elements = Object.keys(wsMessages).map((key, index) => {
    const wsMessage = wsMessages[key];

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
            {wsMessage?.method}
          </Typography>
          <Notifications
            deviceName={deviceName}
            wsMessage={wsMessage}
            elementId={`CCT_${deviceId}_${index}`}
            scrollableElementId={`CC_${deviceId}`}
            index={index}
            key={createUUID()}
          />
        </Stack>
        <Typography id={`CCT_${deviceId}_${index}`} variant="caption" key={createUUID()}>
          {JSON.stringify(wsMessage)}
        </Typography>
      </Fragment>
    );
  });

  return elements;
};

export default WSMessageList;
