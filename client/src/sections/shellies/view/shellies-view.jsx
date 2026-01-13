/*
  Author: André Kreienbring
  ShellyView is the view that presents all (in shellybroker) configured devices.
  For every configured shelly device several values are presented on different tab panels.
  It uses a Websocket client that receives either an array of devices or a single device (update)
  As the filter and sort components are direct childs of this component, they will be maintained by this view.
*/
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { sortText, sortNumeric } from 'src/utils/sort-array';

import TabPanel from 'src/sections/shellies/tabpanel';

import { useShelly } from 'src/sccontext';

import ShellySort from '../shelly-sort';
import ShellyFilters from '../shelly-filters';

export default function ShelliesView() {
  const { user, request, isTest, testDevices } = useShelly();
  const [devices, setDevices] = useState([]);
  const [currentDevices, setCurrentDevices] = useState([]); //filtered / sorted devices
  const [openFilter, setOpenFilter] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [sortOption, setSortOption] = useState('config');

  const [filter, setFilter] = useState({
    models: [],
    generations: [],
    mChecked: [],
    gChecked: [],
    isFilter: false,
    deviceFilters: {},
  });

  const { t } = useTranslation();

  /**
   * Will be called when devices were received via websocket from shellybroker.
   * The available models and generations are extracted from the devices.
   * These will be used for the checkboxes in the filter
   * @param {object} msg The message with a 'device get all' event.
   */
  const handleDevicesReceived = useCallback(
    (msg) => {
      const models = [];
      const generations = [];

      let newDevices = [];
      if (isTest) {
        newDevices = testDevices;
      } else {
        newDevices = msg.data.devices;
      }

      newDevices.forEach((device) => {
        if (!models.includes(device.name)) models.push(device.name);
        if (!generations.includes(device.gen)) generations.push(device.gen);
      });

      // init the filter checkboxes with false
      const newFilter = {
        models,
        generations,
        mChecked: new Array(models.length).fill(false),
        gChecked: new Array(generations.length).fill(false),
        isFilter: false,
        deviceFilters: {},
      };
      setDevices(newDevices);
      setCurrentDevices(newDevices);
      setFilter(newFilter);
    },
    [isTest, testDevices]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    Get all devices of the current user from the websocket server.
  */
  useEffect(() => {
    request(
      {
        event: 'devices get all',
        data: {
          source: 'Shelly View',
          message: 'Shelly View needs the list of devices',
          userid: user.roleid != 1 ? user.userid : null, //an admin gets all devices
        },
      },
      handleDevicesReceived
    );
  }, [handleDevicesReceived, request, user]);
  // --------------------- Websocket Implementation END----------------

  /**
   * Called when a tab panel was selected
   * @param {object} e The event
   * @param {number} tabIndex The index of the selected tab
   */
  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
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
    @returns {array|null} The sorted array of devices (if isReturnResult is true, otherwise null)
  */
  const handleSort = (option, isReturnResult) => {
    setSortOption(option);
    const isFilter = devices.length !== currentDevices.length;
    let sortedDevices;

    switch (option) {
      case 'config':
        // sort by using the original devices array
        sortedDevices = [...devices];
        break;
      case 'gen':
        // numeric sort
        sortedDevices = sortNumeric([...devices], 'gen');
        break;
      default:
        // model, cname and name
        sortedDevices = sortText([...devices], option);
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
    @param {object} deviceFilters  An object that contains the filters to apply.
    @param {array} devices The original array of devices to filter.
    @returns {array} The filtered array of devices.
  */
  const filterDevices = (deviceFilters, devices) => {
    const filteredDevices = devices.filter((device) => {
      for (const key in deviceFilters) {
        if (device[key] === undefined || !deviceFilters[key].includes(device[key])) {
          return false;
        }
      }
      return true;
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
    @param {array} mChecked Contains selected / unselected filter options for models
    @param {array} gChecked Contains selected / unselected filter options for generation
  */
  const handleDeviceFilter = (mChecked, gChecked) => {
    let isFilter = false;
    const deviceFilters = {};
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
      let filteredDevices;
      if (sortOption !== 'config') {
        filteredDevices = handleSort(sortOption, true);
      } else {
        filteredDevices = [...devices];
      }
      filteredDevices = filterDevices(deviceFilters, filteredDevices);
      setCurrentDevices(filteredDevices);
    } else {
      setCurrentDevices(handleSort(sortOption, true));
    }

    // close the filter window when the filter is applied
    setOpenFilter(false);
  };

  return (
    <Container>
      <Typography variant="h4">Shellies</Typography>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ShellyFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            filter={filter}
            handleDeviceFilter={handleDeviceFilter}
          />

          <ShellySort handleSort={handleSort} />
        </Stack>
      </Stack>

      <Box sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
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
      <TabPanel index={currentTabIndex} devices={currentDevices} key="shelliesTab" />
    </Container>
  );
}
