/*
  Author: André Kreienbring
  When the selected Tab changes, this component rerenders the panels
  Every device is presented in his own ShellyCard component or, in case
  of the table tab, a table of the devices is shown.
*/
import { useRef, useCallback } from 'react';
import { differenceInSeconds } from 'date-fns';

import Grid from '@mui/material/Grid';

import { createUUID } from 'src/utils/general';
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-imports
import { fDateTime } from 'src/utils/format-time';

import ShellyCard from 'src/sections/shellies/shelly-card';
import ShellyTable from 'src/sections/shellies/shelly-table';

/**
 * The Tabs of the Shelly view
  @param {integer} index The value of the selected Tab
  @param {array} The array with the devices that will be shown on the TabPanel
*/
const TabPanel = ({ index, devices }) => {
  const types = ['sk', 'ctrl', 'log', 'ws', 'table'];
  const type = types[index];
  const devicesLastUpdate = useRef({});
  // console.log(`TabPanel component rendered for type ${type}`);

  const getDeviceLastUpdate = useCallback((deviceId) => devicesLastUpdate.current[deviceId], []);

  /**
   * Called from ShellyCard to set the last update of a device in the devicesLastUpdate cache
   * @param {string} deviceId The ID of the device
   * @param {integer} ts The timestamp of the last update
   * @param {object} device
   */
  const setDeviceLastUpdate = useCallback((deviceId, ts, device) => {
    devicesLastUpdate.current[deviceId] = { ts, device };
  }, []);

  /**
   * Checks if an update of the device is needed. If yes, returns null.
   * If not, returns the cached device from the last update.
   * An update is needed when the last update was more than 60 seconds ago.
   * The purpose is to avoid too many requests to the server when switching tabs.
   * @param {string} deviceId The ID of the device to look up in devicesLastUpdate array
   * @returns null or the cached device
   */
  const isUpdateNeeded = useCallback((devicId) => {
    const deviceLastUpdate = devicesLastUpdate.current[devicId];
    if (typeof devicesLastUpdate.current[devicId] !== 'undefined') {
      const diffInSeconds = differenceInSeconds(Date.now(), new Date(deviceLastUpdate.ts));
      /*
      console.log(
        `ShellyCard: Dvice ${devices[devicId].cname} now = ${fDateTime(Date.now(), 'HH:mm:ss')} current TS: ${deviceLastUpdate.ts} = ${fDateTime(deviceLastUpdate.ts, 'HH:mm:ss')} Seconds: ${diffInSeconds}`
      );
      */
      if (diffInSeconds >= 60) {
        return null; // device state older the 1 minute: request it
      }
      return devicesLastUpdate.current[devicId].device; // device is fresh enough: use cached device
    }
    return null; // device never was requested: request it
  }, []);

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
      {devices.map((device) => {
        /*
          Check for existing switch controls
        */
        const aSwitch = device.switches[0];

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
          (type === 'ctrl' &&
            (typeof aSwitch?.brightness !== 'undefined' ||
              typeof aSwitch?.white !== 'undefined' ||
              typeof aSwitch?.rgb !== 'undefined'))
        );

        if (showDevice)
          return (
            <Grid key={createUUID()} sx={{ minWidth: type === 'sk' || type === 'ctrl' ? 0 : 1 }}>
              <ShellyCard
                deviceId={device.id}
                deviceGen={device.gen}
                key={device.id}
                type={type}
                isUpdateNeeded={isUpdateNeeded}
                setDeviceLastUpdate={setDeviceLastUpdate}
                getDeviceLastUpdate={getDeviceLastUpdate}
              />
            </Grid>
          );
        return null;
      })}
    </Grid>
  );
};

export default TabPanel;
