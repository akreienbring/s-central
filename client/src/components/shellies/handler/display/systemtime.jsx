/*
  Author: André Kreienbring
  Displays the time of a websocket message.
*/
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';
import { fUnixTime } from 'src/utils/format-time';

/*
  @param {number} ts mandatory the unix time stamp send by a websocket message
*/
const SystemTime = ({ ts }) => (
  <Typography variant="subtitle2" key={createUUID()}>
    {fUnixTime(ts, 'HH:mm')}
  </Typography>
);

export default SystemTime;

SystemTime.propTypes = {
  ts: PropTypes.number.isRequired,
};
