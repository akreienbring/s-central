/*
  Author: André Kreienbring
  AppView is the 'Overview/Dashboard' component of the Application.
  It shows several values, calculated from current websocket notifications 
  of the shelly devices.
  Concept: 
  - The useEffect requests a initial list of devices and the timeline (Minute) and subscribes to further device updates
    - From this various overview values are calculated and the initial timeline chart is build (see handleDevicesReceived)
  - Further websocket messages with updated device data are handled and the overview values are recalculated (see handleDeviceUpdate and handleDevicesUpdate)
  - Only if a device currently consumes power, the timeline is requested again to update the chart
  - The timeline chart can be changed by the user to show different time ranges (Minute, Hour, Day, Month, Year) (see handleTimelineChange)
*/

import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { fWh, fShortenNumber } from 'src/utils/format-number';
import { createUUID, mapNumberToMax } from 'src/utils/general';
import { getDeviceConsumption } from 'src/utils/device-consumption';

import { useChartColors } from 'src/components/chart/chart';

import { useShelly } from 'src/sccontext';

import AppWidgetSummary from '../app-widget-summary';
import calculateOverview from './calculate-overview';
import CurrentConsumption from '../current-consumption';
import TimelineConsumption from '../timline-consumption';
import { buildTimeline, getTimelineOptions } from './build-timeline';

// ----------------------------------------------------------------------

export default function AppView() {
  const [totalPower, setTotalPower] = useState(0);
  const [scripts, setScripts] = useState({ running: 0, count: 0 });
  const [cloudCount, setCloudCount] = useState(0);
  const [colorPerDevice, setColorPerDevice] = useState([]);
  const [powerPerDevice, setPowerPerDevice] = useState([]);
  const [onlineCount, setOnlineCount] = useState({ online: 0, count: 0 });
  const [timelineByDevice, setTimelineByDevice] = useState({
    labels: [],
    colors: [],
    series: [],
    timeline: {},
    maxConsumption: 0,
  });
  const [devices, setDevices] = useState([]);
  const { t } = useTranslation();
  const [selection, setSelection] = useState(0);
  const timeline = useRef({ data: 'Minute', format: 'HH:mm', catformat: 'yyyy-MM-dd HH:mm' });
  const { user, request, subscribe, unsubscribe } = useShelly();
  const chartColors = useChartColors();
  const subscriptionID = useRef(createUUID());
  const isTimelineNeeded = useRef(false);

  /**
    Called when requested timeline data arrives.
    Build the apex charts and rerenders the timeline
    @param {object} msg The message with timeline data.
  */
  const handleTimelineUpdate = useCallback(
    (msg) => {
      let wsDevices;
      if (devices.length !== 0) {
        wsDevices = devices;
      } else if (typeof msg.data.devices !== 'undefined') {
        // when mounted the devices array is empty
        wsDevices = msg.data.devices;
      } else {
        return;
      }

      wsDevices = wsDevices.map((wsDevice, index) => {
        // add a chart color to the device that depends on its index in the array
        wsDevice.chartColor = chartColors[mapNumberToMax(index + 1, chartColors.length)];
        return wsDevice;
      });

      /*
        Construct the timeline chart
      */
      const { rows } = msg.data;
      const chart = buildTimeline(wsDevices, rows, timeline.current);

      if (wsDevices.length > 0)
        setTimelineByDevice({
          labels: chart.labels,
          colors: chart.colors,
          series: chart.series,
          timeline: timeline.current,
          maxConsumption: chart.maxConsumption,
        });
    },
    [devices, chartColors]
  );

  /**
    Called after an update from the websocket server for one device was received.
    Calculates various values for the dashboard.
    If the device currently consumes power, the timeline is also requested again.
    @param {array} wsDevices The (updated) devices received from the websocket server.
  */
  const handleDevicesUpdate = useCallback(
    (wsDevices) => {
      // calculate the values for all devices
      setDevices(wsDevices);
      const overviewValues = calculateOverview(wsDevices);

      setScripts({ running: overviewValues.scriptsRunning, count: overviewValues.scriptsCount });
      setCloudCount(overviewValues.cloudCount);
      setColorPerDevice(overviewValues.colorPerDevice);
      setPowerPerDevice(overviewValues.powerPerDevice);
      setTotalPower(overviewValues.currentPower);
      setOnlineCount({ online: overviewValues.onlineCount, count: wsDevices.length });

      if (!isTimelineNeeded.current) return;

      request(
        {
          event: `getTimeline${timeline.current.data}`,
          data: {
            source: 'App View',
            message: 'App View needs timeline for a device',
          },
        },
        handleTimelineUpdate
      );
    },
    [request, handleTimelineUpdate]
  );

  /**
    Called when the wsmessages of a device were updated.
    Creates a new array with the replaces received device
    and calls the handler that calculates the changes for the Dashboard
    The message with event of 'ShellyUpdate' contains an updated single device
    @param {object} msg The message that contains a single device or the timeline data
  */
  const handleDeviceUpdate = useCallback(
    (msg) => {
      const wsDevice = msg.data.device;

      if (msg.event === 'ShellyUpdate' && msg.type === 'ws') {
        // this view only cares about Shelly websocket messages like 'NotifyStatus' and 'NotifyFullStatus'
        // update the device object in the array and trigger a render
        const wsDevices = devices.map((device, index) => {
          if (device.id === wsDevice.id) {
            /*
              When a device websocket message was updated and the device
              currently consumes power, the current timeline is also requested.
            */
            isTimelineNeeded.current = true;
            const params = wsDevice?.wsmessages?.NotifyFullStatus?.params;
            if (typeof wsDevice !== 'undefined' && typeof params !== 'undefined') {
              const deviceConsumption = getDeviceConsumption(wsDevice.cname, params);
              if (deviceConsumption.totalPower === 0) isTimelineNeeded.current = false;
            }

            // add a chart color to the device that depends on its index in the array
            // this guarantees that the device has always the same color in the chart
            wsDevice.chartColor = chartColors[mapNumberToMax(index + 1, chartColors.length)];
            return wsDevice;
          }
          return device;
        });

        handleDevicesUpdate(wsDevices);
      }
    },
    [handleDevicesUpdate, devices, chartColors]
  );

  /**
    Called when the AppView is mounted and the list of devices 
    and timeline data is received from the server.
    @param {object} msg The message that contains an array of devices
  */
  const handleDevicesReceived = useCallback(
    (msg) => {
      handleTimelineUpdate(msg);
      handleDevicesUpdate(msg.data.devices);
    },
    [handleDevicesUpdate, handleTimelineUpdate]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    After creation of the page all devices and the timeline are requested from the websocket server.
    Further ws messages from the Shelly devices are also handled.
  */
  useEffect(() => {
    const currentSubscriptionID = subscriptionID.current;

    if (devices.length === 0) {
      request(
        {
          event: 'devices timeline get',
          data: {
            source: 'App View',
            message: 'App View needs the list of devices and the timeline',
          },
        },
        handleDevicesReceived
      );
    }

    subscribe(
      {
        subscriptionID: currentSubscriptionID,
        callback: handleDeviceUpdate,
        all: true,
      },
      ['ShellyUpdate']
    );

    /*
      Clean up the websocket subscription when unmounting the component.
    */
    return () => {
      unsubscribe(currentSubscriptionID, ['ShellyUpdate']);
    };
  }, [devices, handleDevicesReceived, handleDeviceUpdate, unsubscribe, subscribe, request]);
  // --------------------- Websocket Implementation END------------------

  /**
    Gets called from the timeline chart, when the dropdown selection changes.
    Sends a request to the websocket server to request the selected timeline.
    Based on the selected timeline some format options are set.
    @param e The event with the selected value
  */
  const handleTimelineChange = (e) => {
    const selectedChart = Number(e.target.value);
    setSelection(selectedChart);
    timeline.current = getTimelineOptions(selectedChart);
    request(
      {
        event: `getTimeline${timeline.current.data}`,
        data: {
          source: 'App View',
          message: 'App View needs timeline for a device',
        },
      },
      handleTimelineUpdate
    );
  };

  if (devices.length === 0) return null;
  return (
    <Container maxWidth="xl">
      <Typography variant="h4">{`${t('_welcome_')} ${user.firstname !== null ? user.firstname : user.alias}`}</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AppWidgetSummary
            data-testid="dashboard_shellies_component"
            title={`${onlineCount.online}/${onlineCount.count}`}
            subtitle={`Shellies ${t('Connected')}`}
            color="success"
            icon={<img alt="icon" src="/assets/icons/overview/S-Shelly-Icon.svg" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AppWidgetSummary
            data-testid="dashboard_totalconsumption_component"
            title={fWh(totalPower)}
            subtitle={t('_consumption_')}
            color="info"
            icon={<img alt="icon" src="/assets/icons/overview/consumption.svg" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AppWidgetSummary
            data-testid="dashboard_scripts_component"
            title={`${scripts.running}/${scripts.count}`}
            subtitle={t('Running')}
            color="success"
            icon={<img alt="icon" src="/assets/icons/overview/script.svg" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AppWidgetSummary
            data-testid="dashboard_cloud_component"
            title={fShortenNumber(cloudCount)}
            subtitle={t('Connected')}
            color="error"
            icon={<img alt="icon" src="/assets/icons/overview/cloud.svg" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
          <CurrentConsumption
            data-testid="dashboard_current_consumption_component"
            title={t('_consumption_')}
            subheader={t('_perShelly_')}
            colors={colorPerDevice}
            powerPerDevice={powerPerDevice}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
          <TimelineConsumption
            data-testid="dashboard_timeline_component"
            title="Timeline"
            subheader={t('_perShelly_')}
            chart={timelineByDevice}
            handleTimelineChange={handleTimelineChange}
            selection={selection}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
