/*
  Author: André Kreienbring
  Presents a list of log messages that were sent from scripts.
  The debug messages were send by UDP to the Shellybroker and forwarded by websocket
  as 'updates' to the devices.

*/
import { memo } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';

/**
  Display the logs of a device per script
  @param {array} scripts The scripts of a device containing the logmessages for each script.
*/
const LogList = ({ scripts }) => {
  if (typeof scripts === 'undefined') return null;

  return scripts.map((script) => {
    if (script?.logmessages?.length > 0) {
      return (
        <Stack spacing={0} key={createUUID()}>
          <Typography variant="subtitle2" key={createUUID()}>
            {script.name}
          </Typography>
          {script.logmessages.map((logmessage) => {
            const time = new Date(logmessage.ts * 1000).toTimeString().substring(0, 8);
            return (
              <Stack direction="row" spacing={1} sx={{ minWidth: 0 }} key={createUUID()}>
                <Typography variant="caption" key={createUUID()}>
                  {time}
                </Typography>
                <Typography variant="caption" noWrap key={createUUID()}>
                  {logmessage.msg}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      );
    }
    return null;
  });
};
export default memo(LogList);

LogList.propTypes = {
  scripts: PropTypes.array.isRequired,
};
