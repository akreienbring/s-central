/*
  Author: André Kreienbring
  When the selected Tab changes, this component rerenders the panels
  Every device is presented in his own ShellyCard component or, in case
  of the table tab, a table of the devices is shown.
*/

import Grid from '@mui/material/Grid';

import { createUUID } from 'src/utils/general';

import ShellyCard from 'src/sections/shellies/shelly-card';
import ShellyTable from 'src/sections/shellies/shelly-table';

/**
  @param {integer} index The value of the selected Tab
  @param {array} The array with the devices that will be shown on the TabPanel
*/
const TabPanel = ({ index, devices }) => {
  const types = ['sk', 'ctrl', 'log', 'ws', 'table'];
  const type = types[index];

  if (type === 'table') {
    return <ShellyTable devices={devices} />;
  }

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
      {devices.map((device, index) => {
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
              <ShellyCard deviceId={device.id} deviceGen={device.gen} key={device.id} type={type} />
            </Grid>
          );
        return null;
      })}
    </Grid>
  );
};

export default TabPanel;
