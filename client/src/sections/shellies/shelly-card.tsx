/*
  Author: André Kreienbring
  This component is shown on one of the tab panels of the shelly view.
  Every device is presented in his own ShellyCard component.

  Every ShellyCard requests the current device information from the shellybroker websocket server.
  This prevents rendering all cards again when the tab in the ShellyView changes.
  Further updates on single devices are received and handled accordingly.
*/
import type { Subscription } from '@src/types/context';
import type {
  Device,
  KVSEntry,
  DeviceScript,
  DeviceSwitch,
  DeviceNotifyMessages,
} from '@src/types/device';

import isEqual from 'lodash/isEqual';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';
import { useShelly } from '@src/hooks/use-shelly';
import Shelly from '@src/sections/shellies/shelly';
import ShellyLogs from '@src/sections/shellies/shelly-logs';
import { memo, useState, useEffect, useCallback } from 'react';
import ShellyKVSList from '@src/sections/shellies/shelly-kvs-list';
import ShellyControls from '@src/sections/shellies/shelly-controls';
import WSMessageList from '@src/sections/shellies/shelly-wsmessagelist';
import ShellyScriptList from '@src/sections/shellies/shelly-script-list';
import updateDeviceValues from '@src/sections/shellies/view/update-device-values';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

/**
 * Used to expand/collapse the KVS list on the ShellyCard
 */
interface ExpandKVSProps {
  expand?: boolean;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  deviceName: string;
}

const ExpandKVS = styled((props: ExpandKVSProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expand, deviceName, ...other } = props;
  return <IconButton data-testid={`shelly_openkvs_button_${deviceName}`} {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface ShellyCardProps {
  deviceId: string;
  deviceGen: number;
  tab: string;
  isUpdateNeeded: (deviceId: string) => Device | null;
  setDeviceLastUpdate: (deviceId: string, timestamp: number, device: Device) => void;
  getDeviceLastUpdate: (deviceId: string) => { ts: number; device: Device } | null;
  handleToggleSelection: (deviceId: string) => void;
  selected: boolean;
  display: 'minimized' | 'maximized';
}
/**
  ShellyCard shows an image of a Shelly device. Device, script, KVS, WS and Log information is presented on a Card
  and Boxes for the device.
  The type of the selected tab panel is indicated by the type prop.
  @param {ShellyCardProps} props
  @param {string} props.deviceId The shelly deviceId that will be rendered on the different tab panels
  @param {integer} props.deviceGen The generation of the shelly device
  @param {string} props.tab The current tab panel to show. Can be:
   'sk': script/kvs 
   'ws': websocket messages from a shelly device
   'log': log messages
   'ctrl': controls of a shelly device
  @param {Function} props.isUpdateNeeded Used to determine if an update of the device is needed
  @param {Function} props.setDeviceLastUpdate Used to set the last update time and the device in the ShellyTabs cache
  @param {Function} props.getDeviceLastUpdate Used to get the last update time and the device in the ShellyTabs cache
  @param {Function} props.handleToggleSelection Used to add or remove a device from the selection for scene creation
  @param {boolean} props.selected Indicates if the card is selected for scene creation
  @param {string} props.display The display value for the sk tab. Can be 'minimized' or 'maximized'
  @returns {JSX.Element} The ShellyCard component
 */
const ShellyCard = ({
  deviceId,
  deviceGen,
  tab,
  isUpdateNeeded,
  setDeviceLastUpdate,
  getDeviceLastUpdate,
  handleToggleSelection,
  selected,
  display,
}: ShellyCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const [scripts, setScripts] = useState<DeviceScript[]>([]);
  const [wsmessages, setWSmessages] = useState<DeviceNotifyMessages>({});
  const [kvs, setKVS] = useState<KVSEntry[]>([]);
  const { request, subscribe, unsubscribe, send, isTest } = useShelly();

  /**
   * Will be called when a device was received via websocket from shellybroker.
   * When loaded a ShellyCard requests the device information from the server.
   * Every time, when a device was received, it updates also the device in the ShellyTabs cache.
   * @param {SrvAnswerMsg} msg The message with a 'device-get' event.
   */
  const handleDeviceReceived = useCallback(
    (msg: SrvAnswerMsg) => {
      const wsDevice = msg.data.device;
      if (typeof wsDevice !== 'undefined') {
        setDevice(() => wsDevice);
        setScripts(() => wsDevice.scripts);
        setWSmessages(
          () =>
            ({
              notifyFullStatus: wsDevice.notifyFullStatus,
              notifyStatus: wsDevice.notifyStatus,
              notifyEvent: wsDevice.notifyEvent,
            }) as DeviceNotifyMessages
        );

        setKVS(() => wsDevice.kvs);

        setDeviceLastUpdate(deviceId, Date.now(), wsDevice);
      }
    },
    [deviceId, setDeviceLastUpdate]
  );

  /**
   * Checks if an update of the device is needed. If yes, requests the device from the server.
   * If not, sets the old device from the ShellyTabs cache.
   * The purpose is to avoid too many requests to the server when switching tabs.
   */
  const checkIfUpdate = useCallback(() => {
    let oldDevice = isUpdateNeeded(deviceId);
    if (oldDevice === null) {
      const requestMsg: CliRequestMsg = {
        event: 'device-get',
        source: 'ShellyCard',
        message: 'ShellyCard needs a device',
        data: {
          deviceId,
        },
      };
      request(requestMsg, handleDeviceReceived);
    } else {
      oldDevice = { ...oldDevice } as Device;
      setDevice(() => oldDevice);
      setScripts(() => oldDevice!.scripts);
      setWSmessages(
        () =>
          ({
            notifyFullStatus: oldDevice!.notifyFullStatus,
            notifyStatus: oldDevice!.notifyStatus,
            notifyEvent: oldDevice!.notifyEvent,
          }) as DeviceNotifyMessages
      );

      setKVS(() => oldDevice!.kvs);
    }
  }, [deviceId, handleDeviceReceived, isUpdateNeeded, request]);

  /**
    Based on the subscription this will be called when an updated device was received via websocket from shellybroker.
    (device-update event)
    Depending on the type of the update, some state will be set.
    Every time, when a device was updated, it updates also the device in the ShellyTabs cache.
    @param {SrvEventMsg} msg The message with a 'device-update' event.
   */
  const handleDeviceUpdate = useCallback(
    (msg: SrvEventMsg) => {
      const eventType = msg.eventType;
      const wsDevice = msg.data.device;
      if (typeof wsDevice !== 'undefined') {
        // by reacting only on changes, unnecessary re-renders are avoided
        switch (eventType) {
          case 'script':
            /*
            If a script is updated then it it either running or not
            This is indicated by a shelly sript sending the information to the SetScript entpoint
            of the shelly broker.
            Also the loghandler sends this type if a sript error occurs and the script is stopped.
          */
            if (!isEqual(scripts, wsDevice.scripts) && tab === 'sk')
              setScripts(() => wsDevice.scripts);
            break;
          case 'kvs':
            /*
            If a KVS value is updated then a shelly script has send the information 
            to the SetKVS entpoint of the shelly broker.
          */
            if (!isEqual(kvs, wsDevice.kvs) && tab === 'sk') setKVS(() => wsDevice.kvs);
            break;
          case 'log':
            /*
            If a scripts log is updated then the log was received via UDP and forwarded
            by the shelly broker.
          */
            if (!isEqual(scripts, wsDevice.scripts) && tab === 'log')
              setScripts(() => wsDevice.scripts);
            break;
          case 'ws': {
            /*
            If the wsmessages were updated then the message was send by the shelly device.
            (received via outbound websocket and forwarded by the shelly broker)
            The 'Notifiy(FullStatus) message also has information of scripts running or not
            and switches with their outputs on or not.
            So it can (additional to the type=script update) also be used to update the script and switch status
          */
            if (
              typeof wsDevice?.notifyFullStatus?.params !== 'undefined' ||
              typeof wsDevice?.notifyStatus?.params !== 'undefined'
            ) {
              const wsMessages: DeviceNotifyMessages = {
                notifyFullStatus: wsDevice.notifyFullStatus,
                notifyStatus: wsDevice.notifyStatus,
                notifyEvent: wsDevice.notifyEvent,
              };

              if (tab === 'ws') {
                setWSmessages(() => wsMessages);
              }

              const oldDevice = getDeviceLastUpdate(wsDevice.id)?.device;

              /*
              Get script and switch values from the 'NotifyFullStatus. When the wsDevice was
              altered setDevice is called.
            */
              if (typeof oldDevice !== 'undefined') {
                const updatedDevice = updateDeviceValues(oldDevice, wsMessages);
                if (updatedDevice !== null) {
                  setDevice(() => updatedDevice);
                  setScripts(() => updatedDevice.scripts);
                }
              } else {
                // this means that a Notify(Full)Status was received before the device was loaded
                console.log(
                  `oldDevice ${wsDevice.cname} is undefined in ShellyCard.handleDeviceUpdate`
                );
              }
            }

            break;
          }
          default:
            /*
            type = device  
            If a device is updated then the shelly is online or not
            This is triggered by a shelly script sending the information to the SetDevice entpoint.
            If a device is reloaded by the server or if a sript was stopped due to an error.
          */
            if (!isEqual(device, wsDevice)) {
              setDevice(() => wsDevice);
            }
        }

        // in each case update the device in the buffer of ShellyTabs with the current timestamp
        setDeviceLastUpdate(wsDevice.id, Date.now(), wsDevice);
      } //wsDevice not undefined
    },
    [device, getDeviceLastUpdate, kvs, scripts, tab, setDeviceLastUpdate]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    After creation of the page the websocket clients 'subscribes' to the shellybroker websocket server
    Further updates on single devices are received and handled accordingly.
  */
  useEffect(() => {
    checkIfUpdate();

    // don't subcribe to the ws server, if the device is not capable of sending updates or a test is running
    if (deviceGen === 0 || isTest) return;

    const subsription: Subscription = {
      subscriptionID: deviceId,
      callback: handleDeviceUpdate,
      all: false,
    };
    subscribe(subsription, ['device-update']);

    /*
      Clean up the websocket subscription when unmounting the component.
     */
    // eslint-disable-next-line consistent-return
    return () => {
      unsubscribe(deviceId, ['device-update']);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // --------------------- Websocket Implementation END------------------

  /**
   * Expands the KVS List
   */
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  /**
    When a switch was clicked, this functions sends a message to
    the WS server. The server will then call the rpc method / websocket to 
    switch the switch.
    @param {object} aSwitch The switch that was clicked on.
  */
  const handleSwitchToggle = (aSwitch: DeviceSwitch) => {
    // add a unix timestamp to prevent sync problems with 'NotifyFullStatus'
    aSwitch.ts = Math.floor(Date.now()) / 1000;
    const reqestMsg: CliRequestMsg = {
      event: `toggle-switch`,
      source: 'Shelly Card',
      message: `${device!.cname} wants to toggle a switch`,
      data: {
        switch: aSwitch,
      },
    };
    send(reqestMsg);
  };

  /**
    When a switch was altered, this functions sends a message to
    the WS server. The server will then call the rpc method / websocket to 
    set the switch.
    @param {DeviceSwitch} aSwitch The switch that was clicked on.
  */
  const handleSwitchSet = (aSwitch: DeviceSwitch) => {
    // add a unix timestamp to prevent sync problems with 'NotifyFullStatus'
    aSwitch.ts = Math.floor(Date.now()) / 1000;

    const reqestMsg: CliRequestMsg = {
      event: `set-switch`,
      source: 'Shelly Card',
      message: `${device!.cname} wants to set a switch`,
      data: {
        switch: aSwitch,
      },
    };
    send(reqestMsg);
  };

  /**
    When a script was started / stopped (toggeld), this functions sends a message to
    the WS server. The server will then call the rpc method / websocket to 
    set the switch to it's new status.
    @param {number} index The index of the script in the array of the scripts of this device.
  */
  const handleScriptToggle = (index: number) => {
    const changedScripts = [...device!.scripts];
    const script: DeviceScript = device!.scripts[index];
    script.running = !script.running;

    // rerender the scriptlist
    changedScripts[index].running = script.running;
    setScripts(changedScripts);

    /*
      After the script was toggeld, the server will send
      a NotifyStatus that is used to update the script on the client side.
    */
    const reqestMsg: CliRequestMsg = {
      event: `toggle-script`,
      source: 'Shelly Card',
      message: `${device!.cname} wants to toggle a script`,
      data: {
        script,
        deviceId: device!.id,
      },
    };
    send(reqestMsg);
  };

  if (typeof device === 'undefined' || device === null) return null;

  return (
    <Card
      data-testid={`shelly_card_${device.cname}`}
      raised
      sx={{
        mb: 0,
        ...(selected &&
          (tab === 'sk' || tab === 'ctrl') && {
            border: 1,
            borderColor: 'primary.main',
          }),
      }}
    >
      <Stack direction={tab === 'ctrl' ? 'column' : 'row'}>
        <Stack>
          <Shelly
            device={device}
            handleSwitchToggle={handleSwitchToggle}
            handleToggleSelection={handleToggleSelection}
            tab={tab}
            display={display}
          />

          {tab === 'sk' && display === 'maximized' && (
            <>
              <CardContent sx={{ minWidth: 200, pt: 0, pb: 0 }}>
                <Stack justifyContent="left" alignItems="flex-start">
                  <ShellyScriptList
                    deviceIP={device.ip}
                    deviceOnline={device.online}
                    scripts={scripts}
                    handleScriptToggle={handleScriptToggle}
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
                  deviceName={device.cname}
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

        {tab === 'ws' && (
          <CardContent
            id={`CC_${deviceId}`}
            sx={{
              display: 'flex',
              width: 1,
              overflowX: 'auto',
              overflowY: 'auto',
            }}
          >
            <Stack>
              <WSMessageList deviceId={deviceId} deviceName={device.name} wsMessages={wsmessages} />
            </Stack>
          </CardContent>
        )}

        {tab === 'log' && (
          <CardContent
            sx={{
              display: 'flex',
              width: 1,
              overflowX: 'auto',
              overflowY: 'auto',
            }}
          >
            <Stack>
              <ShellyLogs scripts={scripts} />
            </Stack>
          </CardContent>
        )}

        {tab === 'ctrl' && (
          <Stack
            sx={{
              minWidth: 215,
              maxWidth: 215,
              pl: 2,
              pr: 2,
              pb: -4,
            }}
          >
            <ShellyControls device={device} handleSwitchSet={handleSwitchSet} />
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default memo(ShellyCard);
