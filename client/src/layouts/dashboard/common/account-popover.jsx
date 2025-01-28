/*
  Author: André Kreienbring
  A Popover that presents functions to edit the current user settings
  and to log out from the system
*/
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { mapNumberToMax } from 'src/utils/general';

import { useShelly } from 'src/sccontext';

import Iconify from 'src/components/iconify';

import UpdateUser from 'src/sections/user/update-user';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [openUpdate, setOpenUpdate] = useState({ open: false, type: '' });

  // eslint-disable-next-line no-unused-vars
  const [showSecuriy, setShowSecurity] = useState(false);
  const { user, logout } = useShelly();
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
    Open / Close the UserUpdate Dialog
    with the type of update that is going to be made
    @param {string} type The type is either 'profile', 'security' or 'settings'
  */
  const handleOpenUpdate = (type) => {
    handleClose();
    setOpenUpdate({ open: true, type });
  };
  const handleCloseUpdate = () => {
    setOpenUpdate({ open: false, type: '' });
  };

  /**
    Navigates to the configure homepage (dashboard or shellies)
    of the current user
   */
  const handleHome = () => {
    handleClose();
    navigate(`${user.home}`);
  };

  /**
   * Opens the Popover itself 
   * @param {object} event 
   */
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };

  /**
   * Handles the click on the logout button
   */
  const handleLogout = () => {
    navigate('/');
    logout();
  };

  /**
   * Maps the type to a title that is displayed in the Popover
   * @param {string} type 
   * @returns The (translated) title
   */
  const getTitle = (type) => {
    if (type === 'profile') {
      return t('_editprofile_');
    }
    if (type === 'security') {
      return t('_editsecurity_');
    }
    return t('_editsettings');
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={`/assets/images/avatars/avatar_${mapNumberToMax(user.id, 25)}.jpg`}
          alt={user.name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {`${user.firstname !== null ? user.firstname : user.alias} ${user.lastname !== null ? user.lastname : user.alias}`}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        marginThreshold={8}
        slotProps={{
          paper: {
            sx: {
              p: 0,
              mt: 1,
              ml: 0.75,
              width: 200,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {`${user.firstname !== null ? user.firstname : user.alias} ${user.lastname !== null ? user.lastname : user.alias}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem key="Home" onClick={handleHome}>
          <ListItemIcon>
            <Iconify icon="eva:home-fill" />
          </ListItemIcon>
          <ListItemText primary={t('Home')} />
        </MenuItem>
        <MenuItem key="Profile" onClick={() => handleOpenUpdate('profile')}>
          <ListItemIcon>
            <Iconify icon="eva:person-fill" />
          </ListItemIcon>
          <ListItemText primary={t('Profile')} />
        </MenuItem>

        <MenuItem key="Security" onClick={() => handleOpenUpdate('security')}>
          <ListItemIcon>
            <Iconify icon="eva:lock-fill" />
          </ListItemIcon>
          <ListItemText primary={t('Security')} />
        </MenuItem>
        <MenuItem key="Settings" onClick={() => handleOpenUpdate('settings')}>
          <ListItemIcon>
            <Iconify icon="eva:settings-2-fill" />
          </ListItemIcon>
          <ListItemText primary={t('Settings')} />
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          {t('Logout')}
        </MenuItem>
      </Popover>
      <UpdateUser
        title={getTitle(openUpdate.type)}
        openUpdate={openUpdate.open}
        type={openUpdate.type}
        onCloseUpdate={handleCloseUpdate}
      />
    </>
  );
}
