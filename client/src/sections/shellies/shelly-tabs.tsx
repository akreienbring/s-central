/*
  Author: André Kreienbring
  When the selected Tab changes, this component rerenders the panels
  Every device is presented in his own ShellyCard component or, in case
  of the table tab, a table of the devices is shown.
*/
import type { Device, DeviceSwitch, DeviceLastUpdateBuffer } from '@src/types/device';

import { useRef, type JSX } from 'react';
import { differenceInSeconds } from 'date-fns';
import { createUUID } from '@src/utils/general';
import { useShelly } from '@src/hooks/use-shelly';
import ShellyCard from '@src/sections/shellies/shelly-card';
import ShellyTable from '@src/sections/shellies/shelly-table';

import Grid from '@mui/material/Grid';

interface ShellyTabsProps {
  index: number;
  devices: Device[];
  display: 'minimized' | 'maximized';
  getTestDevice: (devicId: string) => Device | undefined;
  handleToggleSelection: (deviceId: string) => void;
  selectedDevices: string[];
}
/**
 * The Tabs of the Shelly view
  @param {ShellyTabsProps} props
  @param {number} props.index The value of the selected Tab
  @param {Array} props.devices The array with the devices that will be shown on the ShellyTabs (Filtered / Sorted)
  @param {string} props.display The display value for the sk tab. Can be 'minimized' or 'maximized'
  @param {Function} props.getTestDevice Used if a test is running to get the testdevice from ShellyView
  @param {Function} props.handleToggleSelection Used to add or remove a device from the selection for scene creation
  @param {Array} props.selectedDevices The array with the selected device ids for scene creation
  @returns {JSX.Element} The content of the selected Tab
*/
const ShellyTabs = ({
  index,
  devices,
  display,
  getTestDevice,
  handleToggleSelection,
  selectedDevices,
}: ShellyTabsProps): JSX.Element => {
  const { isTest } = useShelly();

  const tabs = ['sk', 'ctrl', 'log', 'ws', 'table'];
  const tab = tabs[index];
  const devicesLastUpdate = useRef<DeviceLastUpdateBuffer>({});
  console.log(`ShellyTabs rendered for tab ${tab} and received ${devices.length} devices`);

  /**
   * Get the last update of a device from the devicesLastUpdate cache. This is used to determine if an update of the device is needed or if the cached device can be used.
   * @param {string} deviceId The ID of the device to look up in devicesLastUpdate object
   * @returns {object} An object like {ts: timestamp, device: Device} or null if not found
   */
  const getDeviceLastUpdate = (deviceId: string): { ts: number; device: Device } | null => {
    const lastUpdate: { ts: number; device: Device } | undefined =
      devicesLastUpdate.current[deviceId];
    if (typeof lastUpdate !== 'undefined') {
      return lastUpdate;
    }
    return null;
  };

  /**
   * Called from ShellyCard to set the last update of a device in the devicesLastUpdate cache
   * @param {string} deviceId The ID of the device
   * @param {integer} ts The timestamp of the last update
   * @param {object} device
   */
  const setDeviceLastUpdate = (deviceId: string, ts: number, device: Device) => {
    devicesLastUpdate.current[deviceId] = { ts, device };
  };

  /**
   * Checks if an update of the device is needed. If yes, returns null.
   * If not, returns the cached device from the last update.
   * An update is needed when the last update was more than 60 seconds ago.
   * The purpose is to avoid too many requests to the server when switching tabs.
   * @param {string} deviceId The ID of the device to look up in devicesLastUpdate array
   * @returns null or the cached device object { device: Device }
   */
  const isUpdateNeeded = (deviceId: string): Device | null => {
    if (isTest) {
      const testDevice = getTestDevice(deviceId);
      if (typeof testDevice !== 'undefined') return testDevice;
    }

    const lastUpdate: { ts: number; device: Device } | undefined =
      devicesLastUpdate.current[deviceId];

    if (typeof lastUpdate !== 'undefined') {
      const diffInSeconds = differenceInSeconds(Date.now(), new Date(lastUpdate.ts));
      /*
      console.log(
        `ShellyCard: Device ${devices[devicId].cname} now = ${fDateTime(Date.now(), 'HH:mm:ss')} current TS: ${lastUpdate.ts} = ${fDateTime(lastUpdate.ts, 'HH:mm:ss')} Seconds: ${diffInSeconds}`
      );
      */
      if (diffInSeconds >= 60) {
        return null; // device state older than 1 minute: request it
      }
      return lastUpdate.device; // device is fresh enough: use cached device
    }
    return null; // device never was requested: request it
  };

  if (tab === 'table') {
    // using the 'key' trick to force a rerender of the table when devices change
    return <ShellyTable key={JSON.stringify(devices)} devices={devices} />;
  }

  /*
  xs - default
  sm - min width 600px
  md - min width 960px
  lg - min width 1280px
  xl - min width 1920px
  */

  const xs = tab === 'sk' || tab === 'ctrl' ? 12 : 12; // only 1 item in a row
  const sm = tab === 'sk' || tab === 'ctrl' ? 6 : 12; // 2 items in a row for sm
  const md = tab === 'sk' || tab === 'ctrl' ? 4 : 12; // 3 items in a row for md
  const lg = tab === 'sk' || tab === 'ctrl' ? 3 : 12; // 4 items in a row for lg
  const xl = tab === 'sk' || tab === 'ctrl' ? 2 : 12; // 6 items in a row for xl
  return (
    <Grid container spacing={2} size={{ xs, sm, md, lg, xl }}>
      {devices.map((device) => {
        /*
          Check for existing switch controls
        */
        let showCtrl = false;
        if (device?.switches?.length > 0) {
          device.switches.forEach((aSwitch: DeviceSwitch) => {
            showCtrl =
              typeof aSwitch?.brightness !== 'undefined' ||
              typeof aSwitch?.white !== 'undefined' ||
              typeof aSwitch?.rgb !== 'undefined';
          });
        }

        /*
        don't show ws and logs if the device gen is 0
        don't show logs if device gen < 2
        assumption: gen1 devices don't have scripts, kvs, logs and outbound websockets
        don't show controls if there are none
       */
        const showDevice =
          tab === 'sk' ||
          (tab === 'ws' && device.gen > 0) ||
          (tab === 'log' && device.gen > 1) ||
          (tab === 'ctrl' && device.gen > 0 && showCtrl);

        if (showDevice)
          return (
            <Grid key={createUUID()} sx={{ minWidth: tab === 'sk' || tab === 'ctrl' ? 0 : 1 }}>
              <ShellyCard
                deviceId={device.id}
                deviceGen={device.gen}
                key={device.id}
                tab={tab}
                isUpdateNeeded={isUpdateNeeded}
                setDeviceLastUpdate={setDeviceLastUpdate}
                getDeviceLastUpdate={getDeviceLastUpdate}
                handleToggleSelection={handleToggleSelection}
                display={display}
                selected={selectedDevices.includes(device.id)}
              />
            </Grid>
          );
        return null;
      })}
    </Grid>
  );
};

export default ShellyTabs;
