/*
  Author: André Kreienbring
  Presented for adding devices from the user table row entry menue. 
  When clicked a dialog is opened that holds the form to add devices to a user.
*/

import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

/**
  Component that allows to update an existing user
  @param {object} updateuser The user that devices will be added to
  @param {boolean} openDevices To determine if the dialog is shown or not
  @param {function} onCloseDevices Handles the closed status in the UserTableRow
  @param {array} devices The array of all available devices
  @param {array} userDevices The array of devices that are already assigned to the user
  @param {function} handleUserDeviceChange Called when a device is checked/unchecked
  @param {function} handleDevicesSubmit Called when the devices must be submitted to the backend
  @param {object} requestResult The result of the last request (success, message)
  @param {boolean} isChanged To determine if changes were made
*/
export default function AddDevices({
  updateuser,
  openDevices,
  onCloseDevices,
  devices,
  userDevices,
  handleUserDeviceChange,
  handleDevicesSubmit,
  requestResult,
  isChanged,
}) {
  const { t } = useTranslation();

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
          {`${updateuser.firstname} ${updateuser.lastname}`}
        </Typography>
        <IconButton onClick={onCloseDevices}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </Stack>

      <Divider />
      <FormControl fullWidth size="subtitle2" sx={{ maxHeight: 'calc(100% - 180px)' }}>
        <Scrollbar>
          <Stack spacing={0.2}>
            {devices.map((device) => (
              <FormControlLabel
                key={device.id}
                value={device.id}
                control={<Checkbox checked={userDevices.includes(device.id)} />}
                onChange={() => handleUserDeviceChange(device.id)}
                label={device.cname}
              />
            ))}
          </Stack>
        </Scrollbar>
      </FormControl>

      <Typography
        variant="subtitle2"
        color={requestResult.success ? 'success' : 'error'}
        sx={{ my: 2, mx: 2 }}
      >
        {t(requestResult.message)}
      </Typography>
      <Button
        disabled={!isChanged}
        size="large"
        onClick={handleDevicesSubmit}
        color="inherit"
        variant="outlined"
        startIcon={<Iconify icon="formkit:submit" />}
        sx={{ mb: 5, mx: 2 }}
      >
        {t('Save')}
      </Button>
    </Drawer>
  );
}
