/*
  Author: André Kreienbring
  ShellyView is the view that presents all (in shellybroker) configured devices.
  For every configured shelly device several values are presented on different tab panels.
  It implements a Websocket client that receives either an array of devices or a single device (update)
  This websocket is independent from the socket that is implemented by the 'AppView' component.

  As the filter and sort components are direct childs of this component, they will be maintained by this view.
*/
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { sortText, sortNumeric } from 'src/utils/sort-array';

import { useShelly } from 'src/sccontext';

import TabPanel from 'src/components/shellies/tabpanel';
import ViewTitle from 'src/components/shellies/view-title';

import ShellySort from '../shelly-sort';
import ShellyFilters from '../shelly-filters';

export default function ShelliesView() {
  const { request } = useShelly();
  const [openFilter, setOpenFilter] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [devices, setDevices] = useState([]);
  const [filter, setFilter] = useState({
    models: [],
    generations: [],
    mChecked: [],
    gChecked: [],
    isFilter: false,
  });
  const origDevices = useRef([]);
  const { t } = useTranslation();

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    After mounting the page the websocket clients 'subscribes' to the shellybroker websocket server
    The shellybroker will then send an array of devices.
  */
  useEffect(() => {
    if (devices.length === 0)
      request(
        {
          event: 'devices get all',
          data: {
            name: 'Shelly View',
            message: 'Shelly View needs the list of devices',
          },
        },
        handleDevicesReceived
      );
  }, [devices, request]);
  // --------------------- Websocket Implementation END------------------

  /*
    Called when the websocket receives the array of devices after 
    requesting it from the websocket server.
    Updates the state and generates arrays for models and generation that will be used by 
    the filter function.
    The device array that was received, will be saved
    in the 'origDevices' reference hook to restore the original filter settings.
  */
  const handleDevicesReceived = (msg) => {
    // Get available models and gens from the devices array
    // these will be used for the checkboxes in the filter
    const wsDevices = msg.data.devices;
    const models = [];
    const generations = [];

    wsDevices.forEach((device) => {
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
    };
    setFilter(() => newFilter);
    setDevices(() => wsDevices);
    origDevices.current = wsDevices;
  };

  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  /*
    This function is passed as a prop to the sort component and will be called
    after a sort option was selected.
    Dependent on the option the array of the devices will be sorted by the correct 
    comparison. If the selected option is 'config' then the original array will be restored.
    This means that the devices are sorted in the order they were configured in Shellybroker.
  */
  const handleSort = (option) => {
    let sortedDevices;
    switch (option.value) {
      case 'config':
        // restore the original array
        setDevices((prevDevices) => origDevices.current);
        break;
      case 'gen':
        // numeric sort
        sortedDevices = [...devices];
        sortedDevices = sortNumeric(sortedDevices, 'gen');
        setDevices(() => sortedDevices);
        break;
      default:
        sortedDevices = [...devices];
        sortedDevices = sortText(sortedDevices, option.value);
        setDevices(() => sortedDevices);
    }
  };

  /*
    Apply a filter to the original devices array.
    @params {array} mandatory An array that contains the filters to apply.
    @returns {array} The filtered array of devices.
  */
  const filterDevices = (deviceFilters) => {
    const filteredDevices = origDevices.current.filter((device) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in deviceFilters) {
        if (device[key] === undefined || !deviceFilters[key].includes(device[key])) {
          return false;
        }
      }
      return true;
    });
    return filteredDevices;
  };

  /*
    This function is passed as a prop to the filter component and will be called
    after a filter options are selected and submitted.
    Dependent on the checked filter options the array of the devices will be filtered. 
    For this purpose a filter object is created and the passed to the function that
    finally filters the array.
    After filtering (or resetting) the array of devices the state is changed to
    rerender the view.
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

    if (isFilter) {
      setDevices(() => filterDevices(deviceFilters));
    } else {
      setDevices(() => origDevices.current);
    }

    // the following is necessary to show that a filter is active
    // probably it would be enough to use another state for 'isFilter'
    setFilter({
      models: filter.models,
      generations: filter.generations,
      mChecked,
      gChecked,
      isFilter,
    });

    // close the filter window when the filter is applied
    setOpenFilter(false);
  };

  return (
    <Container>
      <ViewTitle title="Shellies" />
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
          <Tab label="Script / KVS" />
          <Tab label={t('Control')} />
          <Tab label="Logs" />
          <Tab label="WS Inspector" />
        </Tabs>
      </Box>
      <TabPanel index={currentTabIndex} devices={devices} key="shelliesTab" />
    </Container>
  );
}
