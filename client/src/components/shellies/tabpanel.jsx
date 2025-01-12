/*
  Author: André Kreienbring
  When the selected Tab changes, this component rerenders the panels
  and generates ShellyCard components.
  Every device is presented in his own ShellyCard component.
*/
import { memo } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid2';

import { createUUID } from 'src/utils/general';

import ShellyCard from 'src/components/shellies/shelly-card';

/*
  @param {integer} index The value of the selected Tab
  @param {array} The array with the devices that will be shown on the TabPanel
*/
const TabPanel = ({ index, devices }) => {
  const types = ['sk', 'ctrl', 'log', 'ws'];
  const type = types[index];

  /*
  xs - default
  sm - min width 600px
  md - min width 960px
  lg - min width 1280px
  xl - min width 1920px
  */

  const xs = type === 'sk' || type === 'ctrl' ? 12 : 12; // only 1 item in a row
  const sm = type === 'sk' || type === 'ctrl' ? 4 : 12; // 3 items in a row for sk
  const md = type === 'sk' || type === 'ctrl' ? 2 : 12; // 6 items in a row for sk
  const lg = type === 'sk' || type === 'ctrl' ? 2 : 12; // 6 items in a row for sk
  const xl = type === 'sk' || type === 'ctrl' ? 2 : 12;
  return (
    <Grid
      container
      spacing={2}
      size={{ xs: { xs }, sm: { sm }, md: { md }, lg: { lg }, xl: { xl } }}
    >
      {devices.map((device) => {
        /*
          Check for existing switch controls
        */
        const brightnessSwitch = device.switches.find(
          (aSwitch) => typeof aSwitch.brightness !== 'undefined'
        );
        const whiteSwitch = device.switches.find((aSwitch) => typeof aSwitch.white !== 'undefined');
        const rgbSwitch = device.switches.find((aSwitch) => typeof aSwitch.rgb !== 'undefined');

        /*
        don't show ws and logs if the device gen is 0
        don't show logs if device gen < 2
        assumption: devices with a gen of 0 don't have scripts, kvs, logs and outbound websockets
        don't show controls if there are none
       */
        const showDevice = !!(
          type === 'sk' ||
          (type === 'ws' && device.gen > 0) ||
          (type === 'log' && device.gen > 1) ||
          (type === 'ctrl' && (brightnessSwitch || whiteSwitch || rgbSwitch))
        );

        if (showDevice)
          return (
            <Grid key={createUUID()} sx={{ minWidth: type === 'sk' || type === 'ctrl' ? 0 : 1 }}>
              <ShellyCard shelly={device} key={device.id} type={type} />
            </Grid>
          );
        return null;
      })}
    </Grid>
  );
};

export default memo(TabPanel);

TabPanel.propTypes = {
  // devices: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  devices: PropTypes.array,
};
