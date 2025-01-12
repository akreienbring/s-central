/*
  Author: André Kreienbring
  Render the current consumption of a Shelly PM device.
*/
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fWh } from 'src/utils/format-number';
import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

/*
  The consumption will be displayed in 'kw/h'.
  @param {number} consume The current energy consumption of a device in mw/m.
*/
const Energy = ({ consume }) => (
  <Stack
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    spacing={0.5}
    key={createUUID()}
  >
    <Iconify
      icon="material-symbols-light:bolt"
      sx={{ color: Number(consume > 0) ? 'blue' : 'black' }}
      key={createUUID()}
    />
    <Typography variant="caption" key={createUUID()}>
      {fWh(consume)}
    </Typography>
  </Stack>
);
export default Energy;

Energy.propTypes = {
  consume: PropTypes.number.isRequired,
};
