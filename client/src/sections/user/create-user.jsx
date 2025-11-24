/*
  Author: André Kreienbring
  Presented as a Button in the user view. When clicked a Drawer is opened
  that holds the form to create a new user.
*/

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import UserForm from './user-form';

/**
  Component the presents a dialog to create a new user
  @param {boolean} openCreate To determine if the dialog is shown or not
  @param {function} onOpenCreate Handles the open status
  @param {function} onCloseCreate Handles the closed status
  @param {function} handleUsersReceived Will be passed to the UserForm to update
    the list of all users
*/
export default function CreateUser({
  openCreate,
  onOpenCreate,
  onCloseCreate,
  handleUsersReceived,
}) {
  const { t } = useTranslation();
  return (
    <>
      <Button
        data-testid="users_newuser_button"
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={onOpenCreate}
      >
        {t('_newuser_')}
      </Button>
      <Drawer
        anchor="right"
        open={openCreate}
        onClose={onCloseCreate}
        slotProps={{
          paper: {
            sx: { width: 300, border: 'none', overflow: 'hidden' },
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            {t('_newuser_')}
          </Typography>
          <IconButton data-testid="createuser_close_button" onClick={onCloseCreate}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />
        <UserForm type="create" handleUsersReceived={handleUsersReceived} />
      </Drawer>
    </>
  );
}

CreateUser.propTypes = {
  openCreate: PropTypes.bool.isRequired,
  onOpenCreate: PropTypes.func.isRequired,
  onCloseCreate: PropTypes.func.isRequired,
  handleUsersReceived: PropTypes.func.isRequired,
};
