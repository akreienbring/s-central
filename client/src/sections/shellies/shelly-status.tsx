/*
  Author: André Kreienbring
  Simple component that renders the online status
  of the device.
*/
import { type JSX } from 'react';
import Iconify from '@src/components/iconify';

/**
 * Diesplays the online (wifi) status of a Shelly device.
  @param {bool} online Is the device online or not?
  @returns {JSX.Element} A wifi or wifi-off icon with green or red color depending on the websocket status.
*/
const ShellyStatus = ({ online }: { online: boolean }): JSX.Element => (
  <Iconify
    icon={online ? 'material-symbols:wifi' : 'material-symbols:wifi-off'}
    sx={{ color: online ? 'green' : 'red' }}
  />
);

export default ShellyStatus;
