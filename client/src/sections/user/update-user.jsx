/*
  Author: André Kreienbring
  Presented for profile editing in the account popover or in a user table row entry. 
  When clicked a dialog is opened that holds the form to update an existing user.
*/

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import UserForm from './user-form';

/**
  Component that allows to update an existing user
  @param {string} title The title that is presented at the top
  @param {boolean} openUpdate To determine if the dialog is shown or not
  @param {type} type: Type of the planned update. Either 'profile', 'security' or 'settings'
  @param {object} updateuser The user that can be updated. Only set when a user
    from UserView / UserTableRow is updated
  @param {function} onCloseUpdate Handles the closed status. Either in the 
    UserView / UserTableRow. Or in the
    AccountPopover component
  @param {function} handleUpdateUser Called when UserView / UserTableRow must rerender the user in the list
*/
export default function UpdateUser({
  title,
  openUpdate,
  type,
  updateuser,
  onCloseUpdate,
  handleUpdateUser,
}) {
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
      <UserForm type={type} updateuser={updateuser} handleUpdateUser={handleUpdateUser} />
    </Drawer>
  );
}
