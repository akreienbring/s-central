/*
  Author: André Kreienbring
  A Popover that presents functions to edit the current user settings
  and to log out from the system.
  Hirarchy:
  Header
  |_AccountPopover
    |_ UpdateUser
      |_UserForm
        |_UserFormDisplay

*/
import type { UserFormType } from '@src/types/user';

import { useState } from 'react';
import { useNavigate } from 'react-router';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';
import { mapNumberToMax } from '@src/utils/general';
import UpdateUser from '@src/sections/user/update-user';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

/**
 * Renders the Account Popover component. From here the user can
 * access his profile, security settings, general settings,
 * navigate to his homepage or log out.
 * @returns
 */
export default function AccountPopover() {
  const [open, setOpen] = useState({ open: false, target: null } as {
    open: boolean;
    target: HTMLButtonElement | null;
  });
  const [openUpdate, setOpenUpdate] = useState({
    open: false,
    type: 'profile',
  } as { open: boolean; type: UserFormType });

  const { user, logout } = useShelly();
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
    Open the UserUpdate Dialog
    with the type of update that is going to be made
    @param {string} type The type is either 'profile', 'security' or 'settings'
  */
  const handleOpenUpdate = (type: UserFormType) => {
    handleClose();
    setOpenUpdate({ open: true, type });
  };
  /**
   * Close the UserUpdate Dialog
   */
  const handleCloseUpdate = () => {
    setOpenUpdate({ open: false, type: 'profile' });
    setOpen({ open: true, target: open.target });
  };

  /**
    Navigates to the configure homepage (dashboard or shellies)
    of the current user
   */
  const handleHome = () => {
    handleClose();
    navigate(`${user!.home}`);
  };

  /**
   * Opens the Account Popover and save the target element
   * for opening it again when closing the UpdateUser dialog
   * @param {object} event The click event with the target element
   */
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen({ open: true, target: event.currentTarget });
  };

  /**
   * Closes the Account Popover by maintaining the target element
   */
  const handleClose = () => {
    setOpen({ open: false, target: open.target });
  };

  /**
   * Maps the type to a title that is displayed in the Popover
   * @param {string} type
   * @returns The (translated) title
   */
  const getTitle = (type: UserFormType) => {
    if (type === 'profile') {
      return t('_editprofile_');
    }
    if (type === 'security') {
      return t('_editsecurity_');
    }
    return t('_editsettings');
  };

  if (!user) return null;
  return (
    <>
      <IconButton
        data-testid="open_account_popover_button"
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            // eslint-disable-next-line jsdoc/require-jsdoc
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={`/assets/images/avatars/avatar_${mapNumberToMax(user.userid!, 25)}.jpg`}
          alt={user!.alias}
          sx={{
            width: 36,
            height: 36,
            // eslint-disable-next-line jsdoc/require-jsdoc
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        />
      </IconButton>

      <Popover
        open={open.open}
        anchorEl={open.target}
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
            {user.firstname && user.lastname
              ? `${user.firstname} ${user.lastname}`
              : user.firstname
                ? user.firstname
                : user.alias}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem data-testid="accountpopover_home_item" key="Home" onClick={handleHome}>
          <ListItemIcon>
            <Iconify icon="eva:home-fill" />
          </ListItemIcon>
          <ListItemText primary={t('Home')} />
        </MenuItem>
        <MenuItem
          data-testid="accountpopover_profile_item"
          key="Profile"
          onClick={() => handleOpenUpdate('profile')}
        >
          <ListItemIcon>
            <Iconify icon="eva:person-fill" />
          </ListItemIcon>
          <ListItemText primary={t('Profile')} />
        </MenuItem>

        <MenuItem
          data-testid="accountpopover_security_item"
          key="Security"
          onClick={() => handleOpenUpdate('security')}
        >
          <ListItemIcon>
            <Iconify icon="eva:lock-fill" />
          </ListItemIcon>
          <ListItemText primary={t('Security')} />
        </MenuItem>
        <MenuItem
          data-testid="accountpopover_settings_item"
          key="Settings"
          onClick={() => handleOpenUpdate('settings')}
        >
          <ListItemIcon>
            <Iconify icon="eva:settings-2-fill" />
          </ListItemIcon>
          <ListItemText primary={t('Settings')} />
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <Button
          data-testid="accountpopover_logout_button"
          color="inherit"
          variant="outlined"
          onClick={logout}
          startIcon={<Iconify icon="material-symbols:logout" />}
          sx={{ color: 'error.main', width: '80%', ml: 2, mb: 2 }}
        >
          {t('Logout')}
        </Button>
      </Popover>
      <UpdateUser
        title={getTitle(openUpdate.type)}
        updateuser={user}
        openUpdate={openUpdate.open}
        type={openUpdate.type}
        onCloseUpdate={handleCloseUpdate}
      />
    </>
  );
}
