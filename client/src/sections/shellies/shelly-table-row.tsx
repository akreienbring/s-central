/*
  Author: André Kreienbring
  A single row in the Shelly table that shows information about a Shelly device.
  It also provides a menu for actions on the device.

  Every TableRow requests the current device information from the shellybroker websocket server.
  This prevents rendering all cards again when the tab in the ShellyView changes.
  Further updates on single devices are received and handled accordingly.

*/
import type { Subscription } from '@src/types/context';
import type { Sys, Device, DeviceTableRow, ShellyTableAction } from '@src/types/device';

import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';
import { fSToTime } from '@src/utils/format-time';
import WifiForm from '@src/sections/shellies/wifi-form';
import { type JSX, useState, useEffect, useCallback } from 'react';
import CircularProgressCount from '@src/components/userinfo/circular-progress-count';

import { Typography } from '@mui/material';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

interface ShellyTableRowProps {
  row: DeviceTableRow;
  labelId: string;
  isItemSelected: boolean;
  handleClick: (id: string) => void;
  handleRebootDevices: (ids?: string[]) => void;
  handleFirmwareUpdates: (type: 'stable' | 'beta', ids?: string[]) => void;
  handleUpdateRow: (newRow: DeviceTableRow) => void;
}

/**
  A single row in the Shelly table that shows information about a Shelly device.
  It also provides a menu for actions on the device.
  @param {ShellyTableRowProps} props   
  @param {object} props.row Device data for this row
  @param {string} props.labelId The id of the label for the checkbox 
  @param {boolean} props.isItemSelected Indicates that the row is selected
  @param {Function} props.handleClick Called when the row is clicked on
  @param {Function} props.handleRebootDevices Called when a single device must be rebooted
  @param {Function} props.handleFirmwareUpdates Called when a firmware update must be performed on a single device
  @param {Function} props.updateRow Called when the row must be updated with new data (e.g. after receiving a websocket update)
  @returns {JSX.Element} A table row with device information and a menu for actions on the device
*/
export default function ShellyTableRow({
  row,
  labelId,
  isItemSelected,
  handleClick,
  handleRebootDevices,
  handleFirmwareUpdates,
  handleUpdateRow,
}: ShellyTableRowProps): JSX.Element {
  const { t } = useTranslation();
  const { request, subscribe, unsubscribe, isTest } = useShelly();
  const [myRow, setMyRow] = useState(row);
  const [openMenue, setOpenMenue] = useState<HTMLButtonElement | null>(null);
  const [openWifi, setOpenWifi] = useState({ open: false });

  /**
    Open the Wifi update Dialog
  */
  const handleOpenWifi = () => {
    setOpenWifi({ open: true });
  };

  /**
    Close the Wifi update Dialog
  */
  const handleCloseWifi = () => {
    setOpenWifi({ open: false });
  };

  /**
    Open / Close the Menue with the actions for a device
    @param {object} e is the click event
  */
  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenMenue(e.currentTarget);
  };

  /**
   * Performs the action from the menu selected by the user and closes the menu.
   * @param {string} [action] The action from the menu to be performed.
   * Possible values are 'reboot', 'stable', 'beta'. If no action is given, the menu will be closed.
   */
  const handleAction = (action: ShellyTableAction) => {
    switch (action) {
      case 'reboot': {
        handleRebootDevices([myRow.id]);
        break;
      }
      case 'stable': {
        handleFirmwareUpdates('stable', [myRow.id]);
        break;
      }
      case 'beta': {
        handleFirmwareUpdates('beta', [myRow.id]);
        break;
      }
      case 'wifi': {
        handleOpenWifi();
        break;
      }
      default:
        break;
    }
    setOpenMenue(null);
  };

  /**
    Will be called when an updated device was received via websocket from shellybroker.
    It updates the row with the new data.
    @param {object} msg The message with a 'device-update' event.
   */
  const handleDeviceUpdate = useCallback(
    (msg: SrvAnswerMsg | SrvEventMsg) => {
      const device: Device | undefined = msg.data.device;
      const sys: Sys | undefined = device?.notifyFullStatus?.params?.sys;
      if (device?.updateStablePending || device?.updateBetaPending) {
        console.log(`Update pending on device ${device?.cname}`);
      }

      if (device && device.gen > 0) {
        // update the row with the new data
        const newRow: DeviceTableRow = {
          id: device.id,
          image: device.image,
          name: device.cname.substring(0, 14),
          model: device.name,
          gen: device.gen,
          uptime: sys ? sys.uptime : 0,
          restart: device.rebootPending ? 'reboot pending' : sys ? sys.restart_required : undefined,
          firmware: device.fw_id,
          stable: device.updateStablePending ? 'stable pending' : device.stable,
          beta: device.updateBetaPending ? 'beta pending' : device.beta,
          reloads: device.reloads,
        };
        handleUpdateRow(newRow);
        setMyRow(newRow);
      }
    },
    [setMyRow, handleUpdateRow]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
     After creation of the page the websocket clients 'subscribes' to the shellybroker websocket server
     Further updates on single devices are received and handled accordingly.
   */
  useEffect(() => {
    // don't request or update the devices if a test is running
    if (isTest) return;

    //Although the device data is already passed to the row, we request it again to have the latest data
    const requestMsg: CliRequestMsg = {
      event: 'device-get',
      source: 'ShellyCard',
      message: 'ShellyCard needs a device',
      data: {
        deviceId: row.id,
      },
    };
    request(requestMsg, handleDeviceUpdate);

    // don't subcribe to the ws server, if the device is not capable of sending updates
    if (row.gen === 0) return;

    const subsription: Subscription = {
      subscriptionID: row.id,
      callback: handleDeviceUpdate,
      all: false,
    };
    subscribe(subsription, ['device-update']);

    /*
       Clean up the websocket subscription when unmounting the component.
    */
    // eslint-disable-next-line consistent-return
    return () => {
      unsubscribe(row.id, ['device-update']);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TableRow
        hover
        onClick={() => handleClick(myRow.id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={myRow.id}
        selected={isItemSelected}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell padding="checkbox">
          <Checkbox color="primary" checked={isItemSelected} />
        </TableCell>
        <TableCell
          align="right"
          sx={{
            minWidth: 70,
            maxWidth: 70,
            objectFit: 'scale-down',
          }}
        >
          <img src={row.image} alt={row.name} width="70" height="70" />
        </TableCell>
        <TableCell id={labelId} scope="row" padding="none">
          <Typography>{myRow.name}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>{myRow.model} </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>{myRow.gen}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>{fSToTime(myRow.uptime)}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography color={myRow.restart === 'reboot pending' ? 'success' : 'string'}>
            {myRow.restart === 'reboot pending' ? (
              <CircularProgress size={25} variant="indeterminate" color="success" />
            ) : myRow.restart ? (
              <Tooltip title={t('_required_')}>
                <Iconify icon="mdi:restart-alert" width={25} height={25} sx={{ color: 'red' }} />
              </Tooltip>
            ) : (
              <Tooltip title={t('_notrequired_')}>
                <Iconify icon="mdi:restart-off" width={25} height={25} />
              </Tooltip>
            )}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>
            {typeof myRow.firmware === 'undefined'
              ? '--'
              : myRow.gen === 1
                ? myRow.firmware.substring(
                    myRow.firmware.lastIndexOf('/') + 2,
                    myRow.firmware.lastIndexOf('g') - 1
                  )
                : myRow.firmware.substring(
                    myRow.firmware.lastIndexOf('/') + 1,
                    myRow.firmware.lastIndexOf('-')
                  )}
          </Typography>
        </TableCell>
        <TableCell align="left">
          {myRow.stable === 'stable pending' ? (
            <CircularProgressCount count={myRow.reloads ? myRow.reloads : 1} max={5} />
          ) : (
            <Typography>{typeof myRow.stable === 'undefined' ? '--' : myRow.stable}</Typography>
          )}
        </TableCell>
        <TableCell align="left">
          {myRow.beta === 'beta pending' ? (
            <CircularProgressCount count={myRow.reloads ? myRow.reloads : 1} max={5} />
          ) : (
            <Typography>{typeof myRow.beta === 'undefined' ? '--' : myRow.beta}</Typography>
          )}
        </TableCell>
        <TableCell align="right">
          <IconButton data-testid={`device${myRow.id}_openmenue_button`} onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={!!openMenue}
        anchorEl={openMenue}
        onClose={handleAction}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 300 },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleAction('stable');
          }}
          disabled={typeof myRow.stable === 'undefined'}
        >
          <Iconify icon="material-symbols:system-update-alt" sx={{ color: 'green', mr: 2 }} />
          {t('_firmwarestable_')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleAction('beta');
          }}
          disabled={typeof myRow.beta === 'undefined'}
        >
          <Iconify icon="material-symbols:system-update-alt" sx={{ color: 'red', mr: 2 }} />
          {t('_firmwarebeta_')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleAction('reboot');
          }}
        >
          <Iconify icon="ix:reboot" sx={{ mr: 2 }} />
          {t('Reboot')}
        </MenuItem>
        <MenuItem
          data-testid={`device${myRow.id}_openwifi_button`}
          onClick={() => handleAction('wifi')}
        >
          <Iconify icon="material-symbols:wifi" sx={{ mr: 2 }} />
          Wifi
        </MenuItem>
      </Popover>
      <WifiForm
        type="single"
        title={`Wifi ${myRow.name}`}
        openWifi={openWifi.open}
        row={myRow}
        onCloseWifi={handleCloseWifi}
        selected={[row.id]}
      />
    </>
  );
}
