/*
  Author: André Kreienbring
  Simple component that renders the online status
  of the device.
*/

import Iconify from 'src/components/iconify';

/**
 * Diesplays the online (wifi) status of a Shelly device.
  @param {bool} online Is the device online or not?
*/
const ShellyStatus = ({ online }) => (
  <Iconify
    icon={online ? 'material-symbols:wifi' : 'material-symbols:wifi-off'}
    sx={{ color: online ? 'green' : 'red' }}
  />
);

export default ShellyStatus;
