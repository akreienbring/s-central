/*
  Author: André Kreienbring
  Renders the scripts of a Shelly devices including their 'running' status.
*/
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';

/*
  The params property of a 'NotifyFullStatus' websocket message may contain
  various script properties. 
  These are checked for the script status and displayed including their memory state
  @param {object} params mandatory The params property of a 'NotifyFullStatus' websocket message
*/
const Scripts = ({ params }) => {
  const elements = [];

  const paramKeys = Object.keys(params);
  paramKeys.forEach((key) => {
    if (key.startsWith('script')) {
      const script = params[key];
      elements.push(
        <Stack
          justifyContent="flex-start"
          alignItems="center"
          spacing={0.5}
          direction="row"
          key={createUUID()}
        >
          <Typography
            variant="subtitle2"
            color={script.running ? 'green' : 'red'}
            key={createUUID()}
          >
            &#123;{script.id}&#125;
          </Typography>
          <Typography variant="caption" key={createUUID()}>
            {Math.round(Number(script.mem_free) / 1024)} kb free
          </Typography>
        </Stack>
      );
    }
  });
  return elements;
};

export default Scripts;

Scripts.propTypes = {
  params: PropTypes.object.isRequired,
};
