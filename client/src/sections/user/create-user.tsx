/*
  Author: André Kreienbring
  Presented as a Button in the user view. When clicked a Drawer is opened
  that holds the form to create a new user.
  Hirarchy:
  UserView
  |_CreateUser
    |_UserForm
      |_UserFormDisplay
*/

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import Scrollbar from '@src/components/scrollbar';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import UserForm from './user-form';

interface CreateUserProps {
  openCreate: boolean;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  handleUsersReceived: (msg: SrvAnswerMsg) => void;
}

/**
  Component the presents a dialog to create a new user
  @param {CreateUserProps} props
  @param {boolean} props.openCreate To determine if the dialog is shown or not
  @param {Function} props.onOpenCreate Handles the open status
  @param {Function} props.onCloseCreate Handles the closed status
  @param {Function} props.handleUsersReceived Will be passed to the UserForm to update the list of all users
  @returns {JSX.Element}
*/
export default function CreateUser({
  openCreate,
  onOpenCreate,
  onCloseCreate,
  handleUsersReceived,
}: CreateUserProps): JSX.Element {
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
        <Scrollbar>
          <UserForm type="create" handleUsersReceived={handleUsersReceived} />
        </Scrollbar>
      </Drawer>
    </>
  );
}
