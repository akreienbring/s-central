/*
  Author: André Kreienbring
  Builds the list of Switches of a device shown on a ShellyCard component
*/
import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';

import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

/*
  If not undefined the switches of a device are shown on top of the ShellyCard.
  @param {string} ip The ip address of the device that owns the switches
  @param {array} switches The switches of a device.
  @param {function} handleClick (in ShellyCard) Will be called when the switch was clicked.
*/
function ShellySwitchList({ ip, switches, handleClick }) {
  if (typeof switches === 'undefined') return null;

  return switches.map((aSwitch, index) => {
    /*
      Add the device ip to the switch. This way the ws server can toggle the switch easily.
      With the added index 'ShellyCard' can toggle the 'output' of the device switch in question.
    */
    aSwitch.ip = ip;
    aSwitch.index = index;

    return (
      <Tooltip title={`Switch ${aSwitch.id}`} key={createUUID()}>
        <Iconify
          icon="icomoon-free:switch"
          sx={{ cursor: 'pointer', color: aSwitch.output ? 'green' : 'black' }}
          onClick={() => handleClick(aSwitch)}
          key={createUUID()}
        />
      </Tooltip>
    );
  });
}

export default ShellySwitchList;

ShellySwitchList.propTypes = {
  ip: PropTypes.string.isRequired,
  switches: PropTypes.array,
  handleClick: PropTypes.func.isRequired,
};
