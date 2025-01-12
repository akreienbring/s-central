/*
  Author: André Kreienbring
  Simple component that renders the online status
  of the device.
*/
import PropTypes from 'prop-types';

import Iconify from 'src/components/iconify';

/*
  @param {bool} online mandatory Is the device online or not?
*/
const ShellyStatus = ({ online }) => (
  <Iconify
    icon={online ? 'material-symbols:wifi' : 'material-symbols:wifi-off'}
    sx={{ color: online ? 'green' : 'red' }}
  />
);

export default ShellyStatus;
ShellyStatus.propTypes = {
  online: PropTypes.bool.isRequired,
};
