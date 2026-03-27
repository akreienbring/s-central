/*
  Author: André Kreienbring
  Displays the time of a websocket message.
*/
import { type JSX } from 'react';
import { createUUID } from '@src/utils/general';
import { fUnixTime } from '@src/utils/format-time';

import Typography from '@mui/material/Typography';

/**
 * Converts and displays the system time
  @param {number} ts the unix time stamp send by a websocket message
  @returns {JSX.Element} the system time as a JSX element
*/
const SystemTime = ({ ts }: { ts: number }): JSX.Element => (
  <Typography variant="subtitle2" key={createUUID()}>
    {fUnixTime(ts, 'HH:mm')}
  </Typography>
);

export default SystemTime;
