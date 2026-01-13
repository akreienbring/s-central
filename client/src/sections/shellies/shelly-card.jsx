/*
  Author: André Kreienbring
  This component is shown on one of the tab panels of the shelly view.
  Every device is presented in his own ShellyCard component.

  Every ShellyCard requests the current device information from the shellybroker websocket server.
  This prevents rendering all cards again when the tab in the ShellyView changes.
  Further updates on single devices are received and handled accordingly.
*/
import isEqual from 'lodash/isEqual';
import { memo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

import Shelly from 'src/sections/shellies/shelly';
import LogList from 'src/sections/shellies/loglist';
import ShellyKVSList from 'src/sections/shellies/shelly-kvs-list';
import ShellyControls from 'src/sections/shellies/shelly-controls';
import WSMessageList from 'src/sections/shellies/shelly-wsmessagelist';
import ShellyScriptList from 'src/sections/shellies/shelly-script-list';
import updateDeviceValues from 'src/sections/shellies/view/update-device-values';

import { useShelly } from 'src/sccontext';

// ----------------------------------------------------------------------

/**
 * Used to expand/collapse the KVS list on the ShellyCard
 */
const ExpandKVS = styled((props) => {
  // eslint-disable-next-line no-unused-vars
  const { expand, ...other } = props;
  return <IconButton data-testid="shelly_openkvs_button" {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

/**
  ShellyCard shows an image of a Shelly device. Device, script, KVS, WS and Log information is presented on a Card
  and Boxes for the device.
  The type of the selected tab panel is indicated by the type prop.
  @param {string} deviceId The shelly deviceId that will be rendered on the different tab panels
  @param {integer} deviceGen The generation of the shelly device
  @param {string} type The current tab panel to show. Can be:
   'sk': script/kvs 
   'ws': websocket messages from a shelly device
   'log': log messages
   'ctrl': controls of a shelly device
   @param {function} isUpdateNeeded Used to determine if an update of the device is needed
   @param {function} setDeviceLastUpdate Used to set the last update time and the device in the TabPanel cache
   @param {function} getDeviceLastUpdate Used to get the last update time and the device in the TabPanel cache
 */
const ShellyCard = ({
  deviceId,
  deviceGen,
  type,
  isUpdateNeeded,
  setDeviceLastUpdate,
  getDeviceLastUpdate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [device, setDevice] = useState();
  const [scripts, setScripts] = useState([]);
  const [wsmessages, setWSmessages] = useState({});
  const [kvs, setKVS] = useState([]);
  const { request, subscribe, unsubscribe, send } = useShelly();
  // console.log(`Rendering ShellyCard for device ${deviceId} of type ${type}`);

  /**
   * Will be called when a device was received via websocket from shellybroker.
   * When loaded a ShellyCard requests the device information from the server.
   * Every time, when a device was received, it updates also the device in the TabPanel cache.
   * @param {object} msg The message with a 'device get' event.
   */
  const handleDeviceReceived = useCallback(
    (msg) => {
      const wsDevice = msg.data.device;
      setDevice(() => wsDevice);
      setScripts(() => wsDevice.scripts);
      setWSmessages(() => wsDevice.wsmessages);
      setKVS(() => wsDevice.kvs);

      setDeviceLastUpdate(deviceId, Date.now(), wsDevice);
    },
    [deviceId, setDeviceLastUpdate]
  );

  /**
   * Checks if an update of the device is needed. If yes, requests the device from the server.
   * If not, sets the old device from the TabPanel cache.
   * The purpose is to avoid too many requests to the server when switching tabs.
   */
  const checkIfUpdate = useCallback(() => {
    let oldDevice = isUpdateNeeded(deviceId);
    if (oldDevice === null) {
      request(
        {
          event: 'device get',
          data: {
            source: 'ShellyCard',
            message: 'ShellyCard needs a device',
            deviceId,
          },
        },
        handleDeviceReceived
      );
    } else {
      oldDevice = { ...oldDevice };
      setDevice(() => oldDevice);
      setScripts(() => oldDevice.scripts);
      setWSmessages(() => oldDevice.wsmessages);
      setKVS(() => oldDevice.kvs);
    }
  }, [deviceId, handleDeviceReceived, isUpdateNeeded, request]);

  /**
    Will be called when an updated device was received via websocket from shellybroker.
    (ShellyUpdate event)
    Depending on the type of the update, some state will be set.
    Every time, when a device was updated, it updates also the device in the TabPanel cache.
    @param {object} msg The message with a 'ShellyUpdate' event.
   */
  const handleDeviceUpdate = useCallback(
    (msg) => {
      const updateType = msg.type;
      const wsDevice = msg.data.device;

      // by reacting only on changes, unnecessary re-renders are avoided
      switch (updateType) {
        case 'script':
          /*
            If a script is updated then it it either running or not
            This is indicated by a shelly sript sending the information to the SetScript entpoint
            of the shelly broker.
          */
          if (!isEqual(scripts, wsDevice.scripts)) setScripts(() => wsDevice.scripts);
          break;
        case 'kvs':
          /*
            If a KVS value is updated then a shelly script has send the information 
            to the SetKVS entpoint of the shelly broker.
          */
          if (!isEqual(kvs, wsDevice.kvs)) setKVS(() => wsDevice.kvs);
          break;
        case 'log':
          /*
            If a scripts log is updated then the log was received via UDP and forwarded
            by the shelly broker.
          */
          if (!isEqual(scripts, wsDevice.scripts)) setScripts(() => wsDevice.scripts);
          break;
        case 'ws': {
          /*
            If the wsmessages were updated then the message was send by the shelly device.
            (received via outbound websocket and forwarded by the shelly broker)
            The 'NotifiyFullStatus message also has information of scripts running or not
            and switches with their outputs on or not.
            So it can (additional to the type=script update) also be used to update the script status
            and to determine the switch status.
          */
          const params = wsDevice?.wsmessages?.NotifyFullStatus?.params;
          if (typeof params !== 'undefined') {
            const oldDevice = getDeviceLastUpdate(deviceId)?.device;

            /*
              Get script and switch values from the 'NotifyFullStatus. When the wsDevice was
              altered setDevice is called.
            */
            if (typeof oldDevice !== 'undefined') {
              const updatedDevice = updateDeviceValues(oldDevice, params);
              if (updatedDevice !== null) {
                setDevice(updatedDevice);
              }
            } else {
              console.log('oldDevice is undefined in ShellyCard.handleDeviceUpdate');
            }
          }
          setWSmessages(() => wsDevice.wsmessages);
          break;
        }
        default:
          /*
          type = device  
          If a device is updated then the shelly is online or not
          This is triggered by a shelly script sending the information to the SetDevice entpoint
          , if a device is reloaded by the server or if a sript was stopped due to an error.
        */
          if (!isEqual(device, wsDevice)) setDevice(() => wsDevice);
      }
      setDeviceLastUpdate(wsDevice.id, Date.now(), wsDevice);
    },
    [device, deviceId, getDeviceLastUpdate, kvs, scripts, setDeviceLastUpdate]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    After creation of the page the websocket clients 'subscribes' to the shellybroker websocket server
    Further updates on single devices are received and handled accordingly.
  */
  useEffect(() => {
    checkIfUpdate();

    // don't subcribe to the ws server, if the device is not capable of sending updates
    if (deviceGen === 0) return;

    subscribe(
      {
        subscriptionID: deviceId,
        callback: handleDeviceUpdate,
        all: false,
      },
      ['ShellyUpdate']
    );

    /*
      Clean up the websocket subscription when unmounting the component.
     */
    // eslint-disable-next-line consistent-return
    return () => {
      unsubscribe(deviceId, ['ShellyUpdate']);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // --------------------- Websocket Implementation END------------------

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  /**
    When a switch was clicked, this functions sends a message to
    the WS server. The server will then call the rpc method / websocket to 
    switch the switch.
    @param {object} aSwitch The switch that was clicked on.
  */
  const handleSwitchToggle = (aSwitch) => {
    // add a unix timestamt to prevent sync problems with 'NotifyFullStatus'
    aSwitch.ts = Math.floor(Date.now()) / 1000;

    send({
      event: `toggleSwitch`,
      data: {
        name: 'Shelly Device',
        message: `${device.cname} wants to toggle a switch`,
        switch: aSwitch,
      },
    });
  };

  /**
    When a switch was altered, this functions sends a message to
    the WS server. The server will then call the rpc method / websocket to 
    set the switch.
    @param {object} aSwitch The switch that was clicked on.
  */
  const handleSwitchSet = (aSwitch) => {
    // add a unix timestamt to prevent sync problems with 'NotifyFullStatus'
    aSwitch.ts = Math.floor(Date.now()) / 1000;

    if (typeof aSwitch.rgb !== 'undefined' && !(aSwitch.rgb instanceof Array)) {
      // convert the current rgb value to an array
      let arrRGB = aSwitch.rgb
        .substring(aSwitch.rgb.indexOf('(') + 1, aSwitch.rgb.indexOf(')'))
        .split(',');
      arrRGB = arrRGB.map((val) => Number(val));
      aSwitch.rgb = arrRGB;
    }

    send({
      event: `setSwitch`,
      data: {
        name: 'Shelly Device',
        message: `${device.cname} wants to set a switch`,
        switch: aSwitch,
      },
    });
  };

  if (typeof device === 'undefined') return null;

  return (
    <Card raised>
      <Stack direction={type === 'ctrl' ? 'column' : 'row'}>
        <Stack>
          <Shelly device={device} handleSwitchToggle={handleSwitchToggle} />

          {type === 'sk' && (
            <>
              <CardContent sx={{ minWidth: 200, pt: 0 }}>
                <Stack justifyContent="left" alignItems="flex-start">
                  <ShellyScriptList
                    deviceIP={device.ip}
                    deviceOnline={device.online}
                    scripts={scripts}
                  />
                </Stack>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton
                  href={`http://${device.ip}/#/key-value-store`}
                  target="_blank"
                  aria-label="show KVS entries"
                >
                  <Iconify
                    icon="material-symbols:storage-rounded"
                    sx={{ color: device?.kvs?.length === 0 ? 'grey' : 'green' }}
                    key={createUUID()}
                  />
                </IconButton>
                <ExpandKVS
                  disabled={device?.kvs?.length === 0}
                  onClick={handleExpandClick}
                  expand={expanded}
                  aria-expanded={expanded}
                  aria-label="show KVS entries"
                >
                  <Iconify icon="mdi:expand-more" sx={{ color: 'gray' }} key={createUUID()} />
                </ExpandKVS>
              </CardActions>
              <Collapse in={expanded} timeout="auto" mountOnEnter unmountOnExit>
                <CardContent sx={{ pt: 0 }}>
                  <Stack justifyContent="left" alignItems="flex-start">
                    <ShellyKVSList deviceIp={device.ip} kvs={kvs} />
                  </Stack>
                </CardContent>
              </Collapse>
            </>
          )}
        </Stack>

        {type === 'ws' && (
          <CardContent
            sx={{
              display: 'flex',
              width: 1,
              overflowX: 'auto',
              overflowY: 'auto',
            }}
          >
            <Stack>
              <WSMessageList deviceName={device.name} wsmessages={wsmessages} />
            </Stack>
          </CardContent>
        )}

        {type === 'log' && (
          <CardContent
            sx={{
              display: 'flex',
              width: 1,
              overflowX: 'auto',
              overflowY: 'auto',
            }}
          >
            <Stack>
              <LogList scripts={scripts} />
            </Stack>
          </CardContent>
        )}

        {type === 'ctrl' && (
          <Box
            bgcolor="white"
            sx={{
              minWidth: 230,
              maxWidth: 230,
              pl: 2,
              pr: 2,
            }}
          >
            <ShellyControls device={device} handleSwitchSet={handleSwitchSet} />
          </Box>
        )}
      </Stack>
    </Card>
  );
};

export default memo(ShellyCard);
