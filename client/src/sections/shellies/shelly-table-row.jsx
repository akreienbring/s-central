/*
  Author: André Kreienbring
  A single row in the Shelly table that shows information about a Shelly device.
  It also provides a menu for actions on the device.

  Every TableRow requests the current device information from the shellybroker websocket server.
  This prevents rendering all cards again when the tab in the ShellyView changes.
  Further updates on single devices are received and handled accordingly.

*/
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import { Typography } from '@mui/material';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { fSToTime } from 'src/utils/format-time';

import { useShelly } from 'src/sccontext';

import Iconify from 'src/components/iconify';

import WifiForm from 'src/sections/shellies/wifi-form';

/**
  A single row in the Shelly table that shows information about a Shelly device.
  It also provides a menu for actions on the device.   
  @param {object} row Device data for this row
  @param {string} labelId The id of the label for the checkbox 
  @param {boolean} isItemSelected Indicates that the row is selected
  @param {function} handleClick Called when the row is clicked on
  @param {function} handleRebootDevices Called when a single device must be rebooted
  @param {function} handleFirmwareUpdates Called when a firmware update must be performed on a single device
  @param {function} updateRow Called when the row must be updated with new data (e.g. after receiving a websocket update)
*/
export default function ShellyTableRow({
  row,
  labelId,
  isItemSelected,
  handleClick,
  handleRebootDevices,
  handleFirmwareUpdates,
  updateRow,
}) {
  const { t } = useTranslation();
  const { request, subscribe, unsubscribe } = useShelly();
  const [myRow, setMyRow] = useState(row);
  const [openMenue, setOpenMenue] = useState(null);
  const [openWifi, setOpenWifi] = useState({ open: false });

  /**
    Open / Close the Wifi update Dialog
  */
  const handleOpenWifi = () => {
    // handleCloseMenu();
    setOpenWifi({ open: true });
  };

  const handleCloseWifi = () => {
    setOpenWifi({ open: false });
  };

  /**
      Open / Close the Menue
      @param {object} event is the click event
    */
  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setOpenMenue(event.currentTarget);
  };

  /**
   * Performs the action from the menu selected by the user and closes the menu.
   * @param {string} [action] The action from the menu to be performed.
   * Possible values are 'reboot', 'stable', 'beta'. If no action is given, the menu will be closed.
   */
  const handleAction = (action) => {
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
    @param {object} msg The message with a 'ShellyUpdate' event.
   */
  const handleDeviceUpdate = useCallback(
    (msg) => {
      const device = msg.data.device;

      if (device.gen > 0) {
        const sys = device?.wsmessages?.NotifyFullStatus?.params?.sys;
        // update the row with the new data
        const newRow = {
          id: device.id,
          image: device.image,
          name: device.cname.substring(0, 14),
          model: device.name,
          gen: device.gen,
          uptime: sys?.uptime,
          restart: device.rebootPending ? 'reboot pending' : sys?.restart_required,
          firmware: device.fw_id,
          stable: device.updateStablePending ? 'stable pending' : device.stable,
          beta: device.updateBetaPending ? 'beta pending' : device.beta,
        };
        updateRow(newRow);
        setMyRow(newRow);
      }
    },
    [setMyRow, updateRow]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
     After creation of the page the websocket clients 'subscribes' to the shellybroker websocket server
     Further updates on single devices are received and handled accordingly.
   */
  useEffect(() => {
    //Although the device data is already passed to the row, we request it again to have the latest data
    request(
      {
        event: 'device get',
        data: {
          source: 'ShellyCard',
          message: 'ShellyCard needs a device',
          deviceId: row.id,
        },
      },
      handleDeviceUpdate
    );

    // don't subcribe to the ws server, if the device is not capable of sending updates
    if (row.gen === 0) return;

    subscribe(
      {
        subscriptionID: row.id,
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
      unsubscribe(row.id, ['ShellyUpdate']);
    };
  }, [row, subscribe, unsubscribe, handleDeviceUpdate]);

  return (
    <>
      <TableRow
        hover
        onClick={(event) => handleClick(event, myRow.id)}
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
          <img src={row.image} alt={row.name} />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          <Typography>{row.name}</Typography>
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
            {myRow.restart === 'reboot pending'
              ? t('_rebootpending_')
              : myRow.restart
                ? t('_required_')
                : t('_notrequired_')}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>
            {typeof myRow.firmware === 'undefined'
              ? '--'
              : myRow.firmware.substring(
                  myRow.firmware.lastIndexOf('/') + 1,
                  myRow.firmware.length
                )}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography color={myRow.stable === 'stable pending' ? 'success' : 'string'}>
            {typeof myRow.stable === 'undefined'
              ? '--'
              : myRow.stable === 'stable pending'
                ? t('_stablepending_')
                : myRow.stable.substring(myRow.stable.lastIndexOf('/') + 1)}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography color={myRow.beta === 'beta pending' ? 'success' : 'string'}>
            {typeof myRow.beta === 'undefined'
              ? '--'
              : myRow.beta === 'beta pending'
                ? t('_betapending_')
                : myRow.beta.substring(myRow.beta.lastIndexOf('/') + 1)}
          </Typography>
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
