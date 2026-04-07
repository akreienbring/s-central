/*
  Author: André Kreienbring
  Presents a single row in the user table with a menu for editing, assigning devices, and deleting the user.
  Hirarchy:
  UserView
  |_CreateUser
  |_UserTableToolbar
  |_UserTableHead
  |_UserTable
    |_TableNoData
    |_TableEmptyRow
    |_UserTableRow
      |_UpdateUser
      |_AddDevices
*/
import type { User } from '@src/types/user';
import type { Device } from '@src/types/device';

import isEqual from 'lodash/isEqual';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';
import UpdateUser from '@src/sections/user/update-user';
import AddDevices from '@src/sections/user/add-devices';
import { type JSX, useState, useEffect, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

interface UserTableRowProps {
  appUser: User | null;
  row: User;
  selected: boolean;
  handleClick: () => void;
  handleDeleteUser: () => void;
  handleUpdateUser: (user: User) => void;
  devices: Device[];
}

/**
  Presents a single row in the user table
  @param {UserTableRowProps} props
  @param {User} props.appUser The logged in user
  @param {User} props.row with the values of the current row
  @param {boolean} props.selected true if the row is selected
  @param {Function} props.handleClick Called when clicking the checkbox of an user entry
  @param {Function} props.handleDeleteUser Called when a user must be deleted
  @param {Function} props.handleUpdateUser Called when a user was updated
  @param {Array} props.devices The array of all available devices
  @returns {JSX.Element}
*/
export default function UserTableRow({
  appUser,
  row,
  selected,
  handleClick,
  handleDeleteUser,
  handleUpdateUser,
  devices,
}: UserTableRowProps): JSX.Element {
  const [openMenue, setOpenMenue] = useState<HTMLButtonElement | null>(null);
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const { t } = useTranslation();
  const [openUpdate, setOpenUpdate] = useState(false);
  const { user, request } = useShelly();
  const [userDevices, setUserDevices] = useState<string[]>([]);
  const [origUserDevices, setOrigUserDevices] = useState<string[]>([]);
  const [requestResult, setRequestResult] = useState<RequestResult>({ success: true, message: '' });
  const [openDevices, setOpenDevices] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  /**
    Called when the requested list of devices currntly assigned to the user
    is received from the server.
    @param {object} msg The received ws message with the list of devices
  */
  const handleUserDevicesReceived = useCallback((msg: SrvAnswerMsg) => {
    if (typeof msg.data.userdevices !== 'undefined') {
      setUserDevices(msg.data.userdevices);
      setOrigUserDevices(msg.data.userdevices);
    }
  }, []);

  // --------------------- Websocket Implementation BEGIN----------------
  /*
      Get all devices of the user in this row from the websocket server.
    */
  useEffect(() => {
    const requestMsg: CliRequestMsg = {
      event: 'user-devices-get-all',
      source: 'Devices Form',
      message: 'Devices Form needs the list of devices of a user',
      data: {
        userid: row.userid,
      },
    };
    request(requestMsg, handleUserDevicesReceived);
  }, [handleUserDevicesReceived, request, row.userid, user]);
  // --------------------- Websocket Implementation BEGIN----------------

  /**
    Add the selected Devices to the user
    Send the updated user devices to the websocket server
  */
  const handleDevicesSubmit = () => {
    const requestMsg: CliRequestMsg = {
      event: 'user-devices-update',
      source: 'Devices Form',
      message: `Updating the devices of user ${row.alias}`,
      data: {
        userid: row.userid,
        ids: userDevices,
      },
    };
    request(requestMsg, handleDevicesUpdate);
  };

  /**
    Called when a 'user devices update' message was received upon a former
    request that was send by 'handleDevicesSubmit'. 
    @param {object} msg The message that was passed with the answer from the server
  */
  const handleDevicesUpdate = (msg: SrvAnswerMsg) => {
    const result = msg.data.requestResult;
    if (result) {
      setRequestResult({
        success: result.success,
        message: result.success ? t('_devicesupdated_') : t('_devicesnotupdated_'),
      } as RequestResult);

      if (result.success) {
        const newUserDevices = [...userDevices];
        setUserDevices(newUserDevices);
        setOrigUserDevices(newUserDevices);
        setIsChanged(false);
      }
    }
  };

  /**
   * Called when a device checkbox was clicked.
   * The userDevices array must be updated accordingly
   * @param {string} device_id The id of the device that was clicked
   */
  const handleUserDeviceChange = (device_id: string) => {
    const newUserDevices = [...userDevices];
    if (newUserDevices.includes(device_id)) {
      newUserDevices.splice(
        newUserDevices.findIndex((id) => id === device_id),
        1
      );
    } else {
      newUserDevices.push(device_id);
    }
    setUserDevices(newUserDevices);
    setRequestResult({ success: true, message: '' });
    if (!isEqual(newUserDevices, origUserDevices)) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  /**
    Open the UserUpdate Dialog
  */
  const handleOpenUpdate = () => {
    handleCloseMenu();
    setOpenUpdate(true);
  };
  /**
    Close the UserUpdate Dialog
  */
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  /**
    Open the Menue of the user tabel row
    @param {object} e is the click event
  */
  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenMenue(e.currentTarget);
    setShowReallyDelete(false);
  };
  /**
    Close the Menue of the user tabel row
  */
  const handleCloseMenu = () => {
    setOpenMenue(null);
  };

  /**
    Add Delete to the Mnue
  */
  const handleShowReally = () => {
    setShowReallyDelete(true);
  };

  /**
    Open the Add-Devices Dialog 
    after closing the menue
  */
  const handleOpenDevices = () => {
    handleCloseMenu();
    setOpenDevices(true);
  };
  /**
    Close the Add--Devices Dialog.
    Also resets the request result message
  */
  const handleCloseDevices = () => {
    setOpenDevices(false);
    setRequestResult({ success: true, message: '' });
    setIsChanged(false);
  };

  return (
    <>
      <TableRow
        data-testid="user_tablerow_component"
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        <TableCell padding="checkbox">
          {row.userid !== 1 && // main admin must not be deleted
            row.userid !== appUser!.userid && // self deletion is not allowed
            (appUser!.roleid === 1 || row.roleid !== 1) && ( // only main admin can delete admins
              <Checkbox disableRipple checked={selected} onChange={handleClick} />
            )}
        </TableCell>
        <TableCell>
          <Avatar alt={row.alias} src={row.avatarUrl} />
        </TableCell>
        <TableCell>
          <Typography>{row.alias}</Typography>
        </TableCell>

        <TableCell>
          <Typography>{row.firstname}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{row.lastname}</Typography>
        </TableCell>

        <TableCell>
          <Typography>{row.role}</Typography>
        </TableCell>

        <TableCell>
          <Typography>{row.email}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{row.home}</Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton data-testid={`${row.alias}_openmenue_button`} onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openMenue}
        anchorEl={openMenue}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        <MenuItem
          data-testid="user_editprofile_button"
          disabled={row.userid === 1 && appUser!.userid !== 1}
          onClick={handleOpenUpdate}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          {t('Edit')}
        </MenuItem>

        {row.roleid !== 1 && (
          <MenuItem data-testid="user_adddevices_button" onClick={() => handleOpenDevices()}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            {t('_assigndevices_')}
          </MenuItem>
        )}
        {!showReallyDelete &&
          row.userid !== 1 && // main admin must not be deleted
          row.userid !== appUser!.userid && // self deletion is not allowed
          (appUser!.roleid === 1 || row.roleid !== 1) && ( // only main admin can delete admins
            <MenuItem
              data-testid="user_delete_button"
              onClick={handleShowReally}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
              {t('Delete')}
            </MenuItem>
          )}

        {showReallyDelete && (
          <MenuItem
            data-testid="user_reallydelete_button"
            onClick={handleDeleteUser}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:question-mark-circle-outline" sx={{ mr: 2 }} />
            {t('_reallydelete_')}
          </MenuItem>
        )}
      </Popover>
      <UpdateUser
        title={t('_edituserprofile_')}
        openUpdate={openUpdate}
        type="profile"
        updateuser={row as User}
        onCloseUpdate={handleCloseUpdate}
        handleUpdateUser={handleUpdateUser}
      />
      <AddDevices
        title={`${row.firstname} ${row.lastname}`}
        openDevices={openDevices}
        handleCloseDevices={handleCloseDevices}
        devices={devices}
        userDevices={userDevices}
        handleUserDeviceChange={handleUserDeviceChange}
        handleDevicesSubmit={handleDevicesSubmit}
        requestResult={requestResult}
        isChanged={isChanged}
      />
    </>
  );
}
