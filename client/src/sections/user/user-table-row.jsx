import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
}) {
  const [openMenue, setOpenMenue] = useState(null);
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const { t } = useTranslation();
  const [openUpdate, setOpenUpdate] = useState({ open: false, type: '' });

  const [openDevices, setOpenDevices] = useState({ open: false });

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
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
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
          <IconButton onClick={handleOpenMenu}>
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
        title={t('_assigndevices_')}
        updateuser={{ alias, firstname, lastname, userid }}
        openDevices={openDevices.open}
        onCloseDevices={handleCloseDevices}
      />
    </>
  );
}
