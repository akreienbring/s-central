/*
  Author: André Kreienbring
  Presented for adding devices from the user table row entry menue. 
  When clicked a dialog is opened that holds the form to add devices to a user.
*/
import type { Device } from '@src/types/device';

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import Scrollbar from '@src/components/scrollbar';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

interface AddDevicesProps {
  title: string;
  openDevices: boolean;
  handleCloseDevices: () => void;
  devices: Device[];
  userDevices: string[];
  handleUserDeviceChange: (deviceId: string) => void;
  handleDevicesSubmit: () => void;
  requestResult: { success: boolean; message: string };
  isChanged: boolean;
}
/**
  Component that allows to update an existing user
  @param {AddDevicesProps} props
  @param {string} props.title Title (The user that devices will be added to)
  @param {boolean} props.openDevices To determine if the dialog is shown or not
  @param {Function} props.handleCloseDevices Handles the closed status in the UserTableRow
  @param {Device[]} props.devices The array of all available devices
  @param {string[]} props.userDevices The array of devices that are already assigned to the user
  @param {Function} props.handleUserDeviceChange Called when a device is checked/unchecked
  @param {Function} props.handleDevicesSubmit Called when the devices must be submitted to the backend
  @param {object} props.requestResult The result of the last request (success, message)
  @param {boolean} props.isChanged To determine if changes were made
  @returns {JSX.Element}
*/
export default function AddDevices({
  title,
  openDevices,
  handleCloseDevices,
  devices,
  userDevices,
  handleUserDeviceChange,
  handleDevicesSubmit,
  requestResult,
  isChanged,
}: AddDevicesProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Drawer
      anchor="right"
      open={openDevices}
      onClose={handleCloseDevices}
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
        <IconButton data-testid="adddevices_close_button" onClick={handleCloseDevices}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </Stack>

      <Divider />
      <FormControl fullWidth sx={{ maxHeight: 'calc(100% - 180px)' }}>
        <Scrollbar>
          <Stack spacing={0.2}>
            {devices.map((device, index) => (
              <FormControlLabel
                key={device.id}
                value={device.id}
                control={
                  <Checkbox
                    data-testid={`adddevices_checkbox_${index}`}
                    checked={userDevices.includes(device.id)}
                  />
                }
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
        data-testid="adddevices_save_button"
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
