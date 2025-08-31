/*
  Author: André Kreienbring
  Renders a form to add devices to a user
*/
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useShelly } from 'src/sccontext';

import Iconify from 'src/components/iconify';

/**
  Presents a form to add devices to a user. Communicates with the 
  websocket server.
  @param {object} updateuser The user that devices will be added to
*/
const DevicesForm = ({ updateuser = { updateuser } }) => {
  const { t } = useTranslation();
  const { request, devices } = useShelly();
  const [userDevices, setUserDevices] = useState([]);
  const [requestResult, setRequestResult] = useState({ success: true, message: '' });

  /**
    Called when a 'user devices update' message was received upon a former
    request that was send by 'handleSubmit'. 
    @param {object} msg The message that was passed with the answer from the server
  */
  const handleDevicesUpdate = (msg) => {
    setRequestResult({
      success: msg.data.success,
      message: msg.data.message,
    });
  };

  /**
    Add the selected Devices to the user
    Send the updated user devices to the websocket server
    @param {object} e The event
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    request(
      {
        event: 'user devices update',
        data: {
          source: 'Devices Form',
          message: `Updating the devices of user ${updateuser.alias}`,
          userid: updateuser.userid,
          userdevices: userDevices,
        },
      },
      handleDevicesUpdate
    );
  };

  /**
    Called when the requested list of devices 
    is received from the server.
    @param {object} msg The received ws message with the list of devices
  */
  const handleUserDevicesReceived = useCallback((msg) => {
    setUserDevices(msg.data.userdevices);
  }, []);

  /**
   * Called when a device checkbox was clicked.
   * The userDevices Array must be updated accordingly
   * @param {string} device_id The id of the device that was clicked
   */
  const handleUserDeviceChange = (device_id) => {
    const newUserDevices = [...userDevices];
    if (newUserDevices.includes(device_id)) {
      newUserDevices.splice(
        newUserDevices.findIndex((id) => id === device_id),
        1
      );
    } else {
      newUserDevices.push(device_id);
    }
    setUserDevices(newUserDevices);
  };

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    A request for all devices of a user is send to the server. The server answers and the response is
    handled accordingly.
 */
  useEffect(() => {
    request(
      {
        event: 'user devices get all',
        data: {
          source: 'Devices Form',
          message: 'Devices Form needs the list of devices of a user',
          userid: updateuser.userid,
        },
      },
      handleUserDevicesReceived
    );
  }, [handleUserDevicesReceived, request, updateuser]);
  // --------------------- Websocket Implementation END------------------

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ height: 1 }}>
      <Stack
        direction="column"
        sx={{
          justifyContent: 'space-between',
          m: 2,
          height: 1,
        }}
      >
        <FormControl fullWidth size="subtitle2">
          <Stack spacing={0.5} sx={{ maxHeight: '99%', overflowY: 'auto' }}>
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
        </FormControl>

        <Typography variant="subtitle2" color={requestResult.success ? 'success' : 'error'}>
          {t(requestResult.message)}
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
  );
};
export default DevicesForm;
