/*
  Author: André Kreienbring
  Builds the list of Switches of a device shown on a ShellyCard component
*/
import type { DeviceSwitch } from '@src/types/device';

import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

interface ShellySwitchListProps {
  switches: DeviceSwitch[];
  handleSwitchClick: (aSwitch: DeviceSwitch) => void;
}

/**
  If not undefined the switches of a device are shown on top of the ShellyCard.
  There may be up to 4 switches in one device (as of now)
  @param {array} switches The switches of a device.
  @param {function} handleSwitchClick (in Shelly) Will be called when the switch was clicked.
*/
function ShellySwitchList({ switches, handleSwitchClick }: ShellySwitchListProps) {
  if (typeof switches === 'undefined') return null;

  return (
    <Stack direction="row" key={createUUID()}>
      {switches.map((aSwitch: DeviceSwitch, index: number) => {
        /*
          With the added index 'ShellyCard' can toggle the 'output' of the device switch in question.
        */
        aSwitch.index = index;

        return (
          <Tooltip title={`Toggle Switch ${aSwitch.id}`} key={createUUID()}>
            <IconButton onClick={() => handleSwitchClick(aSwitch)} sx={{ padding: 0.5 }}>
              <Iconify
                icon="icomoon-free:switch"
                sx={{ cursor: 'pointer', color: aSwitch.output ? 'green' : 'black' }}
                key={createUUID()}
              />
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
}

export default ShellySwitchList;
