/*
  Author: André Kreienbring
  Presents a single row in the user table
*/
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import UpdateUser from 'src/sections/user/update-user';
import AddDevices from 'src/sections/user/add-devices';

import { useShelly } from 'src/sccontext';

// ----------------------------------------------------------------------

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
*/
export default function UserTableRow({
  userid,
  uuid,
  appUser,
  selected,
  alias,
  avatarUrl,
  firstname,
  lastname,
  roleid,
  role,
  email,
  home,
  handleClick,
  handleDeleteUser,
  handleUpdateUser,
  devices,
}) {
  const [openMenue, setOpenMenue] = useState(null);
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const { t } = useTranslation();
  const [openUpdate, setOpenUpdate] = useState({ open: false, type: '' });
  const { user, request } = useShelly();
  const [userDevices, setUserDevices] = useState([]);
  const [origUserDevices, setOrigUserDevices] = useState([]);
  const [requestResult, setRequestResult] = useState({ success: true, message: '' });
  const [openDevices, setOpenDevices] = useState({ open: false });
  const [isChanged, setIsChanged] = useState(false);

  /**
    Called when the requested list of devices currntly assigned to the user
    is received from the server.
    @param {object} msg The received ws message with the list of devices
  */
  const handleUserDevicesReceived = useCallback((msg) => {
    setUserDevices(msg.data.userdevices);
    setOrigUserDevices(msg.data.userdevices);
  }, []);

  // --------------------- Websocket Implementation BEGIN----------------
  /*
      Get all devices of the current user from the websocket server.
    */
  useEffect(() => {
    request(
      {
        event: 'user devices get all',
        data: {
          source: 'Devices Form',
          message: 'Devices Form needs the list of devices of a user',
          userid,
        },
      },
      handleUserDevicesReceived
    );
  }, [handleUserDevicesReceived, request, userid, user]);
  // --------------------- Websocket Implementation BEGIN----------------

  /**
    Add the selected Devices to the user
    Send the updated user devices to the websocket server
    @param {object} e The event
  */
  const handleDevicesSubmit = () => {
    request(
      {
        event: 'user devices update',
        data: {
          source: 'Devices Form',
          message: `Updating the devices of user ${alias}`,
          userid,
          userdevices: userDevices,
        },
      },
      handleDevicesUpdate
    );
  };

  /**
    Called when a 'user devices update' message was received upon a former
    request that was send by 'handleDevicesSubmit'. 
    @param {object} msg The message that was passed with the answer from the server
  */
  const handleDevicesUpdate = (msg) => {
    setRequestResult({
      success: msg.data.success,
      message: msg.data.message,
    });
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
  const handleUserDeviceChange = (device_id) => {
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
  const handleOpenUpdate = (type) => {
    handleCloseMenu();
    setOpenUpdate({ open: true, type });
  };
  const handleCloseUpdate = () => {
    setOpenUpdate({ open: false, type: '' });
  };

  /**
    Open / Close the Menue
    @param {object} event is the click event
  */
  const handleOpenMenu = (event) => {
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
    setOpenDevices({ open: true });
  };
  const handleCloseDevices = () => {
    setOpenDevices({ open: false });
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
          {userid !== 1 && // main admin must not be deleted
            userid !== appUser.userid && // self deletion is not allowed
            (appUser.roleid === 1 || roleid !== 1) && ( // only main admin can delete admins
              <Checkbox disableRipple checked={selected} onChange={handleClick} />
            )}
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={alias} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {alias}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{firstname}</TableCell>
        <TableCell>{lastname}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell>{email}</TableCell>
        <TableCell>{home}</TableCell>

        <TableCell align="right">
          <IconButton data-testid={`user${userid}_openmenue_button`} onClick={handleOpenMenu}>
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
          disabled={userid === 1 && appUser.userid !== 1}
          onClick={() => handleOpenUpdate('profile')}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          {t('Edit')}
        </MenuItem>

        {roleid !== 1 && (
          <MenuItem onClick={() => handleOpenDevices()}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            {t('_assigndevices_')}
          </MenuItem>
        )}
        {!showReallyDelete &&
          userid !== 1 && // main admin must not be deleted
          userid !== appUser.userid && // self deletion is not allowed
          (appUser.roleid === 1 || roleid !== 1) && ( // only main admin can delete admins
            <MenuItem onClick={handleShowReally} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
              {t('Delete')}
            </MenuItem>
          )}

        {showReallyDelete && (
          <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:question-mark-circle-outline" sx={{ mr: 2 }} />
            {t('_reallydelete_')}
          </MenuItem>
        )}
      </Popover>
      <UpdateUser
        title={t('_edituserprofile_')}
        openUpdate={openUpdate.open}
        type={openUpdate.type}
        updateuser={{ alias, email, firstname, lastname, home, userid, roleid, role, uuid }}
        onCloseUpdate={handleCloseUpdate}
        handleUpdateUser={handleUpdateUser}
      />
      <AddDevices
        updateuser={{ alias, firstname, lastname, userid }}
        openDevices={openDevices.open}
        onCloseDevices={handleCloseDevices}
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
