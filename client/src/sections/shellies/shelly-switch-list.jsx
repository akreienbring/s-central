/*
  Author: André Kreienbring
  Builds the list of Switches of a device shown on a ShellyCard component
*/

import Tooltip from '@mui/material/Tooltip';

import { createUUID } from 'src/utils/general';

import Iconify from 'src/components/iconify';

/**
  If not undefined the switches of a device are shown on top of the ShellyCard.
  There may be up to 4 switches in one device (as of now)
  @param {array} switches The switches of a device.
  @param {function} handleClick (in Shelly) Will be called when the switch was clicked.
*/
function ShellySwitchList({ switches, handleClick }) {
  if (typeof switches === 'undefined') return null;

  return switches.map((aSwitch, index) => {
    /*
      With the added index 'ShellyCard' can toggle the 'output' of the device switch in question.
    */
    aSwitch.index = index;

    return (
      <Tooltip title={`Toggle Switch ${aSwitch.id}`} key={createUUID()}>
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
