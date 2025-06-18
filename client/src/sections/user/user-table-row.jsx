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

/*
  @param {function} handleClick Called when clicking the checkbox of an user entry
  @param {function} handleDeleteUser Called when a user must be deleted
  @param {function} handleUpdateUser Called when a user was updated
*/
export default function UserTableRow({
  id,
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
          {roleid !== 1 && <Checkbox disableRipple checked={selected} onChange={handleClick} />}
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
        <MenuItem onClick={() => handleOpenUpdate('profile')}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          {t('Edit')}
        </MenuItem>

        {roleid !== 1 && (
          <MenuItem onClick={() => handleOpenDevices()}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            {t('_assigndevices_')}
          </MenuItem>
        )}
        {!showReallyDelete && roleid !== 1 && (
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
        updateuser={{ alias, email, firstname, lastname, home, id, roleid, role }}
        onCloseUpdate={handleCloseUpdate}
        handleUpdateUser={handleUpdateUser}
      />
      <AddDevices
        title={t('_assigndevices_')}
        updateuser={{ alias, firstname, lastname, id }}
        openDevices={openDevices.open}
        onCloseDevices={handleCloseDevices}
      />
    </>
  );
}
