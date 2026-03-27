/*
  Author: André Kreienbring
  Presented for profile editing in the account popover or in a user table row entry. 
  When clicked a dialog is opened that holds the form to update an existing user.
  Hirarchy:
  UserTableRow or AccountPopover
  |_UpdateUser
    |_UserForm
      |_UserFormDisplay
*/
import type { User, UserFormType } from '@src/types/user';

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import Scrollbar from '@src/components/scrollbar';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import UserForm from './user-form';

interface UpdateUserProps {
  title: string;
  openUpdate: boolean;
  type: UserFormType;
  updateuser: User;
  onCloseUpdate: () => void;
  handleUpdateUser?: (user: User) => void;
}

/**
  Component that allows to update an existing user
  @param {string} title The title that is presented at the top
  @param {boolean} openUpdate To determine if the dialog is shown or not
  @param {UserFormType} type: Type of the planned update. Either 'profile', 'security' or 'settings'
  @param {User} updateuser The user that can be updated. Only set when a user
    from UserView / UserTableRow is updated
  @param {function} onCloseUpdate Handles the closed status. Either in the 
    UserView / UserTableRow. Or in the
    AccountPopover component
  @param {function} handleUpdateUser Called when UserView / UserTableRow must rerender the user in the list
  @returns {JSX.Element}
*/
export default function UpdateUser({
  title,
  openUpdate,
  type,
  updateuser,
  onCloseUpdate,
  handleUpdateUser,
}: UpdateUserProps): JSX.Element {
  return (
    <Drawer
      anchor="right"
      open={openUpdate}
      onClose={onCloseUpdate}
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
          {title}
        </Typography>
        <IconButton data-testid="updateuser_close_button" onClick={onCloseUpdate}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </Stack>

      <Divider />
      <Scrollbar>
        <UserForm type={type} updateuser={updateuser} handleUpdateUser={handleUpdateUser} />
      </Scrollbar>
    </Drawer>
  );
}
