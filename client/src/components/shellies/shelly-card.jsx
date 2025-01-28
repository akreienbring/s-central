/*
  Author: André Kreienbring
  This component is shown on one of the tab panels of the shelly view.
  Every device is presented in his own ShellyCard component.
*/
import PropTypes from 'prop-types';
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

import { useShelly } from 'src/sccontext';

import Iconify from 'src/components/iconify';
import Shelly from 'src/components/shellies/shelly';
import LogList from 'src/components/shellies/loglist';
import ShellyKVSList from 'src/components/shellies/shelly-kvs-list';
import ShellyControls from 'src/components/shellies/shelly-controls';
import WSMessageList from 'src/components/shellies/shelly-wsmessagelist';
import ShellyScriptList from 'src/components/shellies/shelly-script-list';

import updateDeviceValues from 'src/sections/shellies/view/update-device-values';

// ----------------------------------------------------------------------

const ExpandKVS = styled((props) => {
  // eslint-disable-next-line no-unused-vars
  const { expand, ...other } = props;
  return <IconButton {...other} />;
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
  @param shelly The shelly device that will be rendered on the different tab panels
  @param {string) type The current tab panel to show. Can be:
   'sk': script/kvs 
   'ws': websocket messages from a shelly device
   'log': log messages
   'ctrl': controls of a shelly device
*/
const ShellyCard = ({ shelly, type }) => {
  const [expanded, setExpanded] = useState(false);
  const [device, setDevice] = useState(shelly);
  const [scripts, setScripts] = useState(shelly.scripts);
  const [wsmessages, setWSmessages] = useState(shelly.wsmessages);
  const [kvs, setKVS] = useState(shelly.kvs);
  const { subscribe, unsubscribe, send } = useShelly();

  /**
    Will be called when an updated device was received via websocket from shellybroker.
    Depending on the type of the update, some state will be set.
    @param {object} msg The message with a 'ShellyUpdate' event.
   */
  const handleDeviceUpdate = useCallback(
    (msg) => {
      const updateType = msg.type;
      const wsDevice = msg.data.device;

      switch (updateType) {
        case 'script':
          /*
            If a script is updated then it it either running or not
            This is indicated by a shelly sript sending the information to the SetScript entpoint
            of the shelly broker.
          */
          setScripts((prevScripts) => wsDevice.scripts);
          break;
        case 'kvs':
          /*
            If a KVS value is updated then a shelly script has send the information 
            to the SetKVS entpoint of the shelly broker.
          */
          setKVS((prevKVS) => wsDevice.kvs);
          break;
        case 'log':
          /*
            If a scripts log is updated then the log was received via UDP and forwarded
            by the shelly broker.
          */
          setScripts((prevScripts) => wsDevice.scripts);
          // setDevice(wsDevice);
          break;
        case 'ws': {
          /*
            If the wsmessages were updated then the message was send by the shelly device.
            (received via outbound websocket and forwarded by the shelly broker.
            The 'NotifiyFullStatus message also has information over scripts running or not
            and switches with their outputs on or not.
            So it can (additional to the type=script update) also be used to update the script status
            and to determine the switch status.
          */
          const params = wsDevice?.wsmessages?.NotifyFullStatus?.params;
          /*
            Get script and switch values from the 'NotifyFullStatus. When the wsDevice was
            altered setDevice is called.
          */
          if (typeof params !== 'undefined') {
            const updatedDevice = updateDeviceValues(device, params);
            if (updatedDevice !== null) {
              setDevice((prevDevice) => updatedDevice);
            }
          }
          setWSmessages((prevWSmessages) => wsDevice.wsmessages);
          break;
        }
        default:
          /*
            type = device  
            If a device is updated then the shelly is online or not
            This is triggered by a shelly script sending the information to the SetDevice entpoint
            of the shelly broker or if wshandler has reloaded a device
          */
          setDevice((prevDevice) => wsDevice);
      }
    },
    [device]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    After creation of the page the websocket clients 'subscribes' to the shellybroker websocket server
    Further updates on single devices are received and handled accordingly.
  */
  useEffect(() => {
    // don't subcribe to the ws server, if the device is not capable of sending updates
    if (shelly.gen === 0) return;

    subscribe(
      {
        subscriptionID: shelly.id,
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
      unsubscribe(shelly.id, ['ShellyUpdate']);
    };
  }, [shelly, subscribe, unsubscribe, handleDeviceUpdate]);
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
    // add a timestamp to prevent sync problems with 'NotifyFullStatus'
    aSwitch.ts = Date.now();

    send({
      event: `toggleSwitch`,
      data: {
        name: 'Shelly Device',
        message: `${shelly.cname} wants to toggle a switch`,
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
    // add a timestamp to prevent sync problems with 'NotifyFullStatus'
    aSwitch.ts = Date.now();

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
        message: `${shelly.cname} wants to toggle a switch`,
        switch: aSwitch,
      },
    });
  };

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
                    <ShellyKVSList kvs={kvs} />
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
              minWidth: 220,
              maxWidth: 220,
              maxHeight: 180,
              minHeight: 180,
              mb: 2,
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

ShellyCard.propTypes = {
  shelly: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};
