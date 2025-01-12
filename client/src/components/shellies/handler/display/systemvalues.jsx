/*
  Author: André Kreienbring
  Displays system values sent with a 'NotifyFullStatus' websocket message.
*/
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

/*
  The values will be displayed in kb
  @param {object} sys mandatory The sys property of a 'NotifyFullStatus' websocket message.
*/
const SystemValues = ({ sys }) => (
  <Stack
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    spacing={0.5}
    key={createUUID()}
  >
    <Iconify icon="material-symbols-light:sd" sx={{ color: 'black' }} key={createUUID()} />
    <Typography variant="caption" key={createUUID()}>
      {Math.round(Number(sys.ram_free) / 1024)} kb free
    </Typography>
    <Iconify icon="material-symbols:storage-rounded" sx={{ color: 'black' }} key={createUUID()} />
    <Typography variant="caption" key={createUUID()}>
      {Math.round(Number(sys.fs_free) / 1024)} kb free
    </Typography>
  </Stack>
);

export default SystemValues;

SystemValues.propTypes = {
  sys: PropTypes.object.isRequired,
};
