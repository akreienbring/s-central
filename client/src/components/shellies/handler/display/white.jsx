/*
  Author: André Kreienbring
  Displays the white value sent with a 'NotifyFullStatus' websocket message.
*/
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

/**
  The values will be displayed in kb
  @param {object} white The white property of a 'NotifyFullStatus' websocket message.
*/
const White = ({ white }) => (
  <Stack
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    spacing={0.5}
    key={createUUID()}
  >
    <Iconify icon="stash:circle-dot" key={createUUID()} />
    <Typography variant="caption" key={createUUID()}>
      {white}
    </Typography>
  </Stack>
);

export default White;

White.propTypes = {
  white: PropTypes.number,
};
