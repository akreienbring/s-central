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
  @param {number} userid The unique identifier of the user
  @param {object} appUser The logged in user
  @param {boolean} selected To determine if the user entry is selected or not
  @param {string} alias The alias of the user
  @param {string} avatarUrl The URL of the avatar image
  @param {string} firstname The first name of the user
  @param {string} lastname The last name of the user
  @param {number} roleid The unique identifier of the role
  @param {string} role The name of the role
  @param {string} email The email address of the user
  @param {string} home The home location of the user
  @param {function} handleClick Called when clicking the checkbox of an user entry
  @param {function} handleDeleteUser Called when a user must be deleted
  @param {function} handleUpdateUser Called when a user was updated
  @param {array} devices The array of all available devices
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
    setRequestResult({
      success: msg.data.success,
      message: msg.message,
    } as RequestResult);
    if (msg.data.success) {
      const newUserDevices = [...userDevices];
      setUserDevices(newUserDevices);
      setOrigUserDevices(newUserDevices);
      setIsChanged(false);
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
    Open / Close the UserUpdate Dialog
    with the type of update that is going to be made
    @param {string} type is either 'profile' or 'security'
  */
  const handleOpenUpdate = () => {
    handleCloseMenu();
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  /**
    Open / Close the Menue
    @param {object} event is the click event
  */
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenMenue(event.currentTarget);
    setShowReallyDelete(false);
  };
  const handleCloseMenu = () => {
    setOpenMenue(null);
  };

  /**
    Add Delete to the Mnue
    @param {object} event is the click event
  */
  const handleShowReally = () => {
    setShowReallyDelete(true);
  };

  /**
    Open / Close the Devices Dialog
    with the type of update that is going to be made
  */
  const handleOpenDevices = () => {
    handleCloseMenu();
    setOpenDevices(true);
  };
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
