/*
  Author: André Kreienbring
  Renders the current available stable firmware update version of a Shelly device.
*/
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

/**
  @param {string} version The available stable Firmware version of a Shelly device
*/
const Firmware = ({ version }) => (
  <Stack
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    spacing={0.5}
    key={createUUID()}
  >
    <Iconify icon="material-symbols:system-update-alt" sx={{ color: 'green' }} key={createUUID()} />
    <Typography variant="caption" key={createUUID()}>
      {version}
    </Typography>
  </Stack>
);

export default Firmware;

Firmware.propTypes = {
  version: PropTypes.string.isRequired,
};
