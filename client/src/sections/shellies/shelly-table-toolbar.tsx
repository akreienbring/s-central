/*
  Author: André Kreienbring
  A Toolbar for the Shelly table that allows batch operations on selected devices.
*/
import { type JSX, useState } from 'react';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import WifiForm from '@src/sections/shellies/wifi-form';

import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

interface ShellyTableToolbarProps {
  selected: string[];
  handleRebootDevices: (ids?: string[]) => void;
  handleFirmwareUpdates: (type: 'stable' | 'beta', ids?: string[]) => void;
}

/**
  Component that provides a toolbar for batch operations on selected Shelly devices.
  It includes options for rebooting devices, performing firmware updates, and updating WiFi settings.
  @param {ShellyTableToolbarProps} props
  @param {Array} props.selected The ids of selected devices
  @param {Function} props.handleRebootDevices Function to handle rebooting selected devices
  @param {Function} props.handleStableUpdates Function to handle stable firmware updates for selected devices
  @param {Function} props.handleBetaUpdates Function to handle beta firmware updates for selected devices
  @param {Alert} props.alert The current state of the batch operation alert
  @param {Function} props.setAlert Function to update the state of the batch operation alert
  @returns {JSX.Element} A toolbar with batch operation options for selected devices
*/
export default function ShellyTableToolbar({
  selected,
  handleRebootDevices,
  handleFirmwareUpdates,
}: ShellyTableToolbarProps): JSX.Element {
  const { t } = useTranslation();
  const [openWifi, setOpenWifi] = useState({ open: false });

  /**
    Open the Wifi update Dialog
  */
  const handleOpenWifi = () => {
    setOpenWifi({ open: true });
  };
  /**
    Close the Wifi update Dialog
  */
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
            // eslint-disable-next-line jsdoc/require-jsdoc
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
