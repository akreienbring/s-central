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
import type { Device } from '@src/types/device';
import type { Subscription } from '@src/types/context';
import type { TimelineData } from '@src/types/timeline';

import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';
import { useChartColors } from '@src/components/chart/chart';
import { fWh, fShortenNumber } from '@src/utils/format-number';
import { createUUID, mapNumberToMax } from '@src/utils/general';
import { useRef, useState, useEffect, useCallback } from 'react';
import { getDeviceConsumption } from '@src/utils/device-consumption';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { type SelectChangeEvent } from '@mui/material';

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
  const [colorPerDevice, setColorPerDevice] = useState<string[]>([]);
  const [powerPerDevice, setPowerPerDevice] = useState<{ label: string; value: number }[]>([]);
  const [onlineCount, setOnlineCount] = useState({ online: 0, count: 0 });
  const [timelineByDevice, setTimelineByDevice] = useState<TimelineData>({
    labels: [],
    colors: [],
    series: [],
    timeline: { data: 'Minute', format: 'HH:mm', catformat: 'yyyy-MM-dd HH:mm' },
    maxConsumption: 0,
  });
  const [devices, setDevices] = useState<Device[]>([]);
  const { t } = useTranslation();
  const [selection, setSelection] = useState(0);
  const timeline = useRef({ data: 'Minute', format: 'HH:mm', catformat: 'yyyy-MM-dd HH:mm' });
  const { user, request, subscribe, unsubscribe } = useShelly();
  const chartColors = useChartColors();
  const subscriptionID = useRef(createUUID());
  const addedConsumption = useRef(0);
  const lastTimelineRequest = useRef(0);

  /**
    Called when requested timeline data arrives.
    Build the apex charts and rerenders the timeline
    @param {object} msg The message with timeline data.
  */
  const handleTimelineUpdate = useCallback(
    (msg: SrvAnswerMsg) => {
      let wsDevices: Device[];
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

      if (wsDevices.length > 0 && typeof rows !== 'undefined') {
        const chart = buildTimeline(wsDevices, rows, timeline.current);
        setTimelineByDevice({
          labels: chart.labels,
          colors: chart.colors,
          series: chart.series,
          timeline: timeline.current,
          maxConsumption: chart.maxConsumption,
        } as TimelineData);
      }
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
    (wsDevices: Device[]) => {
      // calculate the values for all devices
      setDevices(wsDevices);
      const overviewValues = calculateOverview(wsDevices);

      setScripts({ running: overviewValues.scriptsRunning, count: overviewValues.scriptsCount });
      setCloudCount(overviewValues.cloudCount);
      setColorPerDevice(overviewValues.colorPerDevice);
      setPowerPerDevice(overviewValues.powerPerDevice);
      setTotalPower(overviewValues.currentPower);
      setOnlineCount({ online: overviewValues.onlineCount, count: wsDevices.length });

      // only request the timeline when comsumption has changed atleast a minute ago
      const nowTS = Math.floor(Date.now()) / 1000;
      // console.log(nowTS - lastTimelineRequest.current);
      // console.log(addedConsumption.current);
      if (addedConsumption.current === 0 || nowTS - lastTimelineRequest.current < 60) return;
      lastTimelineRequest.current = nowTS;
      addedConsumption.current = 0;

      const requestMsg = {
        event: `timeline-get-${timeline.current.data}`,
        source: 'App View',
        message: 'App View needs the timeline of the devices',
        data: {},
      } as CliRequestMsg;
      request(requestMsg, handleTimelineUpdate);
    },
    [request, handleTimelineUpdate]
  );

  /**
    Called when a device was updated on the server side.
    Creates a new array with the replaced received device
    and calls the handler that calculates the changes for the Dashboard
    The message with event of 'device-update' contains an updated single device
    @param {object} msg The message that contains a single device or the timeline data
  */
  const handleDeviceUpdate = useCallback(
    (msg: SrvEventMsg) => {
      const wsDevice = msg.data.device;

      if (msg.eventType === 'ws' && typeof wsDevice !== 'undefined') {
        // this view only cares about Shelly websocket messages like 'NotifyStatus' and 'NotifyFullStatus'
        // update the device object in the array and trigger a render
        const wsDevices = devices.map((device, index) => {
          if (device.id === wsDevice.id) {
            /*
              When a device websocket message was updated and the device
              currently consumes power, this is added to the consumption.
            */
            const params = wsDevice?.notifyFullStatus?.params;
            if (typeof params !== 'undefined') {
              const deviceConsumption = getDeviceConsumption(wsDevice.cname, params);
              addedConsumption.current += deviceConsumption.totalPower;
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
    (msg: SrvAnswerMsg) => {
      lastTimelineRequest.current = Math.floor(Date.now()) / 1000;
      if (typeof msg.data.devices !== 'undefined') {
        handleTimelineUpdate(msg);
        handleDevicesUpdate(msg.data.devices);
      }
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
      const requestMsg: CliRequestMsg = {
        event: 'devices-timeline-get',
        source: 'App View',
        message: 'App View needs the list of devices and the timeline',
        data: {},
      };
      request(requestMsg, handleDevicesReceived);
    }

    const subscription: Subscription = {
      subscriptionID: currentSubscriptionID,
      callback: handleDeviceUpdate,
      all: true,
    };
    subscribe(subscription, ['device-update']);

    /*
      Clean up the websocket subscription when unmounting the component.
    */
    return () => {
      unsubscribe(currentSubscriptionID, ['device-update']);
    };
  }, [devices, handleDevicesReceived, handleDeviceUpdate, unsubscribe, subscribe, request]);
  // --------------------- Websocket Implementation END------------------

  /**
    Gets called from the timeline chart, when the dropdown selection changes.
    Sends a request to the websocket server to request the selected timeline.
    Based on the selected timeline some format options are set.
    @param e The event with the selected value
  */
  const handleTimelineChange = (e: SelectChangeEvent<unknown>) => {
    const selectedChart = Number(e.target.value);
    setSelection(selectedChart);
    timeline.current = getTimelineOptions(selectedChart);

    lastTimelineRequest.current = Math.floor(Date.now()) / 1000;
    addedConsumption.current = 0;

    const requestMsg = {
      event: `timeline-get-${timeline.current.data}`,
      source: 'App View',
      message: 'App View needs timeline for a device',
      data: {},
    } as CliRequestMsg;
    request(requestMsg, handleTimelineUpdate);
  };

  if (devices.length === 0 || !user) return null;
  return (
    <Container maxWidth="xl">
      <Typography
        variant="h4"
        sx={{ mb: 5 }}
      >{`${t('_welcome_')} ${user.firstname !== null ? user.firstname : user.alias}`}</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AppWidgetSummary
            data-testid="dashboard_shellies_component"
            title={`${onlineCount.online}/${onlineCount.count}`}
            subtitle={`Shellies ${t('Connected')}`}
            icon={<img alt="icon" src="/assets/icons/overview/S-Shelly-Icon.svg" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AppWidgetSummary
            data-testid="dashboard_totalconsumption_component"
            title={fWh(totalPower)}
            subtitle={t('_consumption_')}
            icon={<img alt="icon" src="/assets/icons/overview/consumption.svg" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AppWidgetSummary
            data-testid="dashboard_scripts_component"
            title={`${scripts.running}/${scripts.count}`}
            subtitle={t('Running')}
            icon={<img alt="icon" src="/assets/icons/overview/script.svg" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AppWidgetSummary
            data-testid="dashboard_cloud_component"
            title={fShortenNumber(cloudCount)}
            subtitle={t('Connected')}
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
