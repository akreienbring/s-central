/*
  Author: André Kreienbring
  A Toolbar for the Shelly table that allows batch operations on selected devices.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import FadingAlert from 'src/components/userinfo/fadingalert';

import WifiForm from 'src/sections/shellies/wifi-form';

/**
  Component that provides a toolbar for batch operations on selected Shelly devices.
  It includes options for rebooting devices, performing firmware updates, and updating WiFi settings.
  @param {array} selected The ids of selected devices
  @param {function} handleRebootDevices Function to handle rebooting selected devices
  @param {function} handleStableUpdates Function to handle stable firmware updates for selected devices
  @param {function} handleBetaUpdates Function to handle beta firmware updates for selected devices
  */
export default function ShellyTableToolbar({
  selected,
  handleRebootDevices,
  handleFirmwareUpdates,
  alert,
  setAlert,
}) {
  const { t } = useTranslation();
  const [openWifi, setOpenWifi] = useState({ open: false });

  /**
    Open / Close the Wifi update Dialog
  */
  const handleOpenWifi = () => {
    setOpenWifi({ open: true });
  };
  const handleCloseWifi = () => {
    setOpenWifi({ open: false });
  };

  return (
    <>
      <Toolbar
        sx={[
          {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          },
          selected.length > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          },
        ]}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            px: 1,
            py: 2,
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '60%',
          }}
        >
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: '1 1 40%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {`Batch ${selected.length}`} {t('selected')}
            </Typography>
          ) : (
            <Typography sx={{ flex: '1 1 40%' }} variant="h6" id="tableTitle" component="div">
              Batch
            </Typography>
          )}
          <FadingAlert
            text={t('Select devices to enable batch actions.')}
            severity="info"
            alert={alert}
            setAlert={setAlert}
          />
        </Stack>
        {selected.length > 0 && (
          <Stack
            direction="row"
            sx={{ px: 1, py: 2, justifyContent: 'flex-end', alignItems: 'center', width: '40%' }}
          >
            <Tooltip title={t('_firmwarestable_')}>
              <IconButton onClick={() => handleFirmwareUpdates('stable')}>
                <Iconify icon="material-symbols:system-update-alt" sx={{ color: 'green' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('_firmwarebeta_')}>
              <IconButton onClick={() => handleFirmwareUpdates('beta')}>
                <Iconify icon="material-symbols:system-update-alt" sx={{ color: 'red' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Reboot')}>
              <IconButton onClick={() => handleRebootDevices()}>
                <Iconify icon="ix:reboot" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Wifi">
              <IconButton onClick={() => handleOpenWifi()}>
                <Iconify icon="material-symbols:wifi" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Toolbar>
      <WifiForm
        type="selected"
        title={`Wifi ${selected.length} ${t('selected')}`}
        openWifi={openWifi.open}
        onCloseWifi={handleCloseWifi}
        selected={selected}
      />
    </>
  );
}
