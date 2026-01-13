/*
  Author: André Kreienbring
  Displays the time of a websocket message.
*/

import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';
import { fUnixTime } from 'src/utils/format-time';

/**
 * Converts and displays the system time
  @param {number} ts the unix time stamp send by a websocket message
*/
const SystemTime = ({ ts }) => (
  <Typography variant="subtitle2" key={createUUID()}>
    {fUnixTime(ts, 'HH:mm')}
  </Typography>
);

export default SystemTime;
