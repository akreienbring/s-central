/*
  Author: André Kreienbring
  ShellyView is the view that presents all (in shellybroker) configured devices.
  For every configured shelly device several values are presented on different tab panels.
  It uses a Websocket client that receives either an array of devices or a single device (update)
  As the filter and sort components are direct childs of this component, they will be maintained by this view.
*/

import type { Device, Filter, SortOption, DeviceFilters } from '@src/types/device';

import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';
import { getComparator } from '@src/utils/sort-array';
import TabPanel from '@src/sections/shellies/tabpanel';
import { type JSX, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import ShellySort from '../shelly-sort';
import ShellyFilters from '../shelly-filters';
import { applyDeviceSort } from '../shelly-sort-utils';

/**
 * The main view for the shelly devices. It presents all devices in different tabs and offers filter and sort options.
 * The devices are received from the websocket server and stored in the state. When a device update is received, the corresponding device in the state will be updated.
 * The filter and sort options are also stored in the state and applied to the devices when they are changed.
 * The view is divided into different tab panels that present different values of the devices. The components for the tab panels are located in the 'tabpanels' folder.
 * @returns {JSX.Element} The main view for the shelly devices.
 */
export default function ShelliesView(): JSX.Element {
  const { user, request, isTest } = useShelly();
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentDevices, setCurrentDevices] = useState<Device[]>([]); //filtered / sorted devices
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [sortOption, setSortOption] = useState<SortOption>('config');
  const [display, setDisplay] = useState<'minimized' | 'maximized'>('maximized');

  const [filter, setFilter] = useState<Filter>({
    models: [],
    generations: [],
    mChecked: [],
    gChecked: [],
    isFilter: false,
    deviceFilters: {} as DeviceFilters,
  });

  const { t } = useTranslation();

  /**
   * Will be called when devices were received via websocket from shellybroker.
   * The available models and generations are extracted from the devices.
   * These will be used for the checkboxes in the filter
   * @param {object} msg The message with a 'devices-get-all' event.
   */
  const handleDevicesReceived = useCallback((msg: SrvAnswerMsg) => {
    const models: string[] = [];
    const generations: string[] = [];

    const newDevices = msg.data.devices as Device[];

    newDevices.forEach((device) => {
      // console.log(JSON.stringify(device));
      if (!models.includes(device.name)) models.push(device.name);
      if (!generations.includes(device.gen.toString())) generations.push(device.gen.toString());
    });

    // init the filter checkboxes with false
    const newFilter: Filter = {
      models,
      generations,
      mChecked: new Array(models.length).fill(false),
      gChecked: new Array(generations.length).fill(false),
      isFilter: false,
      deviceFilters: {} as DeviceFilters,
    };
    setDevices(newDevices);
    setCurrentDevices(newDevices);
    setFilter(newFilter);
  }, []);

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    Get all devices of the current user from the websocket server.
  */
  useEffect(() => {
    if (user === null) return;
    const requestMsg: CliRequestMsg = {
      event: 'devices-get-all',
      source: 'Shelly View',
      message: 'Shelly View needs the list of devices',
      data: {
        userid: user.roleid != 1 ? user.userid : undefined, //an admin gets all devices
        istest: isTest,
      },
    };
    request(requestMsg, handleDevicesReceived);
  }, [handleDevicesReceived, request, user, isTest]);
  // --------------------- Websocket Implementation END----------------

  /**
   * Called from TabPanel ONLY when a test is running.
   * @param {deviceId} The ID of a test device
   * @returns {Device} The original Testdevice
   */
  const getTestDevice = (deviceId: string): Device | undefined =>
    currentDevices.find((device) => device.id === deviceId);

  /**
   * Called when a tab panel was selected
   * @param {object} e The event
   * @param {number} value The index of the selected tab
   */
  const handleTabChange = (e: React.SyntheticEvent, value: number) => {
    if (value !== 0) setDisplay('maximized');
    setCurrentTabIndex(value);
  };

  /**
   * Opens / closes the filter dialog
   */
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  /**
    This function is passed as a prop to the sort component and will be called
    after a sort option was selected.
    Dependent on the option the array of the devices will be sorted by the correct 
    comparison. If the selected option is 'config' then the original array will be restored.
    This means that the devices are sorted in the order they were configured in Shellybroker.
    @param {string} option The selected sort option
    @param {boolean} isReturnResult If true, the sorted array will be returned. If false, the state will be set to rerender the view.
    @returns {Device[] | null} The sorted array of devices (if isReturnResult is true, otherwise null)
  */
  const handleSort = (option: SortOption, isReturnResult: boolean): Device[] | null => {
    setSortOption(option);
    const isFilter = devices.length !== currentDevices.length;
    let sortedDevices: Device[] = [];

    switch (option) {
      case 'config':
        // sort by using the original devices array
        sortedDevices = [...devices];
        break;
      case 'gen':
        // numeric sort
        sortedDevices = applyDeviceSort({
          inputData: devices,
          comparator: getComparator('asc', 'gen'),
        });
        break;
      default:
        // cname and name
        sortedDevices = applyDeviceSort({
          inputData: devices,
          comparator: getComparator('asc', option),
        });
    }

    if (isReturnResult) {
      return sortedDevices;
    } else {
      if (isFilter) sortedDevices = filterDevices(filter.deviceFilters, sortedDevices);
      setCurrentDevices(() => sortedDevices);
      return null;
    }
  };

  /**
    Apply a filter to an array of devices.
    @param {DeviceFilters} deviceFilters  An object that contains the filters to apply.
    @param {Device[]} devices The original array of devices to filter.
    @returns {Device[]} The filtered array of devices.
  */
  const filterDevices = (deviceFilters: DeviceFilters, devicesToFilter: Device[]): Device[] => {
    const filteredDevices: Device[] = devicesToFilter.filter((device) => {
      for (const key in deviceFilters) {
        // TODO find a way to do if (deviceFilters[key].includes(device[key])) dynamically in typescript
        if (
          (key === 'name' && deviceFilters[key].includes(device[key])) ||
          (key === 'gen' && deviceFilters[key].includes(device[key].toString()))
        ) {
          return true;
        }
      }
      return false;
    });
    return filteredDevices;
  };

  /**
    This function is passed as a prop to the filter component and will be called
    after a filter options are selected and submitted.
    Dependent on the checked filter options the array of the devices will be filtered. 
    For this purpose a filter object is created and the passed to the function that
    finally filters the array.
    After filtering (or resetting) the array of devices the state is changed to
    rerender the view.
    @param {boolean[]} mChecked Contains selected / unselected filter options for models
    @param {boolean[]} gChecked Contains selected / unselected filter options for generation
  */
  const handleDeviceFilter = (mChecked: boolean[], gChecked: boolean[]) => {
    let isFilter: boolean = false;
    const deviceFilters: DeviceFilters = { name: [], gen: [] };
    filter.models.forEach((model, index) => {
      if (mChecked[index]) {
        isFilter = true;
        if (typeof deviceFilters.name === 'undefined') deviceFilters.name = [];
        deviceFilters.name.push(model);
      }
    });

    filter.generations.forEach((generation, index) => {
      if (gChecked[index]) {
        isFilter = true;
        if (typeof deviceFilters.gen === 'undefined') deviceFilters.gen = [];
        deviceFilters.gen.push(generation);
      }
    });

    setFilter({
      models: filter.models,
      generations: filter.generations,
      mChecked,
      gChecked,
      isFilter,
      deviceFilters,
    });

    if (isFilter) {
      let filteredDevices: Device[] = [];
      if (sortOption !== 'config') {
        const sortedDevices = handleSort(sortOption, true);
        if (sortedDevices !== null) filteredDevices = sortedDevices;
      } else {
        filteredDevices = [...devices];
      }
      filteredDevices = filterDevices(deviceFilters, filteredDevices);
      setCurrentDevices(filteredDevices);
    } else {
      const sortedDevices = handleSort(sortOption, true);
      if (sortedDevices !== null) setCurrentDevices(sortedDevices);
    }

    // close the filter window when the filter is applied
    setOpenFilter(false);
  };

  const handleDisplayChange = (newDisplay: 'minimized' | 'maximized') => {
    setDisplay(newDisplay);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4">Shellies</Typography>
      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end">
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          {currentTabIndex === 0 && display === 'minimized' && (
            <IconButton onClick={() => handleDisplayChange('maximized')}>
              <Iconify icon="solar:maximize-square-2-outline" />
            </IconButton>
          )}
          {currentTabIndex === 0 && display === 'maximized' && (
            <IconButton onClick={() => handleDisplayChange('minimized')}>
              <Iconify icon="solar:minimize-square-2-outline" />
            </IconButton>
          )}
          <ShellyFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            filter={filter}
            handleDeviceFilter={handleDeviceFilter}
          />

          <ShellySort handleSort={(sort: SortOption) => handleSort(sort, false)} />
        </Stack>
      </Stack>

      <Box>
        <Tabs
          value={currentTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="shelly tabs"
        >
          <Tab data-testid="shellies_script_tab" label="Script / KVS" />
          <Tab data-testid="shellies_control_tab" label={t('Control')} />
          <Tab data-testid="shellies_logs_tab" label="Logs" />
          <Tab data-testid="shellies_ws_tab" label="WS Inspector" />
          <Tab data-testid="shellies_list_tab" label="List / Batch" />
        </Tabs>
      </Box>
      <TabPanel
        index={currentTabIndex}
        devices={currentDevices}
        key="shelliesTab"
        display={display}
        getTestDevice={getTestDevice}
      />
    </Container>
  );
}
