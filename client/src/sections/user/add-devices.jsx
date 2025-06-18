/*
  Author: André Kreienbring
  Presented for adding devices from the user table row entry menue. 
  When clicked a dialog is opened that holds the form to add devices to a user.
*/

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import DevicesForm from './devices-form';

/**
  Component that allows to update an existing user
  @param {string} title The title that is presented at the top
  @param {object} updateuser The user that devices will be added to
  @param {boolean} openDevices To determine if the dialog is shown or not
  @param {function} onCloseDevices Handles the closed status in the UserTableRow
*/
export default function AddDevices({ title, updateuser, openDevices, onCloseDevices }) {
  return (
    <Drawer
      anchor="right"
      open={openDevices}
      onClose={onCloseDevices}
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
          {`${title}: ${updateuser.alias}`}
        </Typography>
        <IconButton onClick={onCloseDevices}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </Stack>

      <Divider />
      <DevicesForm updateuser={updateuser} />
    </Drawer>
  );
}
