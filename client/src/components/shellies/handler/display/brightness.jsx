/*
  Author: André Kreienbring
  Displays the brightness valuew sent with a 'NotifyFullStatus' websocket message.
*/
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

/*
  The values will be displayed in kb
  @param {object} sys mandatory The brightness property of a 'NotifyFullStatus' websocket message.
*/
const Brightness = ({ brightness }) => (
  <Stack
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    spacing={0.5}
    key={createUUID()}
  >
    <Iconify icon="subway:black-white" width={18} height={18} key={createUUID()} />
    <Typography variant="caption" key={createUUID()}>
      {brightness}%
    </Typography>
  </Stack>
);

export default Brightness;

Brightness.propTypes = {
  brightness: PropTypes.number,
};
