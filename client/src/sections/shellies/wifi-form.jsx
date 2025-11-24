/*
  Author: André Kreienbring
  A Dialog presented for viewing and updating the wifi settings of a single Shelly device
  or for updating the wifi settings of multiple devices at once.
*/
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import { Box, Button, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useShelly } from 'src/sccontext';

import Iconify from 'src/components/iconify';

/**
  Component that allows to view and update the wifi settings of a Shelly device.
  @param {string} type Must be either 'single' or 'selected'. 
  @param {string} title The title that is presented at the top
  @param {boolean} openWifi To determine if the dialog is shown or not
  @param {object} row The device data used when type is 'single'
  @param {function} onCloseWifi Handles the closed status. Called when the dialog is closed
  @param {array} selected The ids of selected devices used when type is 'selected'
*/
export default function WifiForm({ type, title, openWifi, row, onCloseWifi, selected }) {
  const [wifiSettings, setwifiSettings] = useState(
    type === 'single' ? {} : { ssid: '', password: '', ap: { enabled: false } }
  );
  const [showPassword, setShowPassword] = useState(false);
  const [requestResult, setRequestResult] = useState({
    success: true,
    message: '',
    successful: 0,
    total: 0,
  });

  const { t } = useTranslation();
  const { request } = useShelly();

  /**
    Called when the Wifi settings of a device are received from the server.
    @param {object} msg The received ws message with the wifi settings of a device
  */
  const handleWifiSettingssReceived = useCallback((msg) => {
    setwifiSettings(msg.data.wifisettings);
  }, []);

  /**
    Called when the result of the wifi update request is received from the server.
    The result is presented to the user.
    @param {object} msg The received ws message with the result of the wifi update request
   */
  const handleWifiUpdateResult = useCallback((msg) => {
    setRequestResult({
      success: msg.data.success,
      successful: msg.data.successful,
      total: msg.data.total,
      message: msg.data.message,
    });
  }, []);

  // --------------------- Websocket Implementation BEGIN----------------
  /*
      A request for the Wifi settings of the device is send to the server. The server answers and the response is
      handled accordingly.
   */
  useEffect(() => {
    if (openWifi)
      if (type === 'single' && _.isEmpty(wifiSettings)) {
        request(
          {
            event: 'device get wifi settings',
            data: {
              source: 'Wifi Form',
              message: 'Wifi Form needs the wifi settings of a device',
              deviceId: row.id,
            },
          },
          handleWifiSettingssReceived
        );
      }
  }, [row, handleWifiSettingssReceived, request, openWifi, type, wifiSettings]);
  // --------------------- Websocket Implementation END------------------

  /**
    Submits the form and sends the updated wifi settings to the server.
    @param {object} e The event
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    request(
      {
        event: 'device wifi update',
        data: {
          source: 'Wifi Form',
          message: `Updating the wifi settings`,
          wifiSettings,
          ids: type === 'single' ? [row.id] : selected,
        },
      },
      handleWifiUpdateResult
    );
  };

  /**
    All controlled inputs constantly keep the 'wifiSettings' state up to date.
    This way it can be directly submitted to the server without collecting the form entries.
    @param {object} e The event with the target that holds input field values that were changed
  */
  const handleInputChange = (e) => {
    const newWifiSettings = { ...wifiSettings };
    newWifiSettings[e.target.name] = e.target.value;
    setwifiSettings(newWifiSettings);
  };

  if (_.isEmpty(wifiSettings)) return null;

  return (
    <Drawer
      anchor="right"
      open={openWifi}
      onClose={onCloseWifi}
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
        <IconButton data-testid="device_closewifi_button" onClick={onCloseWifi}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </Stack>
      <Typography variant="subtitle2" color="error" sx={{ ml: 1 }}>
        {t('_wifiwarming_')}
      </Typography>

      <Divider />
      <FormControl fullWidth size="subtitle2">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Stack spacing={3} sx={{ px: 3, py: 3 }}>
            <TextField
              required
              autoComplete="off"
              label="SSID"
              name="ssid"
              value={wifiSettings.ssid}
              onChange={handleInputChange}
              slotProps={{
                htmlInput: { 'data-testid': 'wifi_ssid_input' },
              }}
            />
            <TextField
              required
              name="password"
              autoComplete="new-password"
              label={t('Password')}
              onChange={handleInputChange}
              type={showPassword ? 'text' : 'password'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                htmlInput: { minLength: 8, maxLength: 63 },
              }}
            />
            {type === 'single' && (
              <>
                <TextField disabled label="IP" name="ip" value={wifiSettings.ip} />
                <TextField disabled label="Mode" name="ipv4mode" value={wifiSettings.ipv4mode} />
                <TextField disabled label="Gatway" name="gw" value={wifiSettings.gw} />
                <TextField disabled label="Mask" name="netmask" value={wifiSettings.netmask} />
                <TextField
                  disabled
                  label="DNS"
                  name="nameserver"
                  value={wifiSettings.nameserver != null ? wifiSettings.nameserver : ''}
                />
              </>
            )}
            <FormControlLabel
              required
              control={<Checkbox color="error" />}
              label={t('_acceptrisk_')}
            />

            <Typography variant="subtitle2" color={requestResult.success ? 'success' : 'error'}>
              {t(requestResult.message, {
                successful: requestResult.successful,
                total: requestResult.total,
              })}
            </Typography>
            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="formkit:submit" />}
            >
              {t('Save')}
            </Button>
          </Stack>
        </Box>
      </FormControl>
    </Drawer>
  );
}
