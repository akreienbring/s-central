/*
  Author: André Kreienbring
  Component that shows the image of a shelly device and available switches
  and some additional information like name and generation.
  Used by the shelly card on different tab panels.
*/
import type { Device, DeviceSwitch } from '@src/types/device';

import { type JSX, useState } from 'react';
import ShellyStatus from '@src/sections/shellies/shelly-status';
import ShellySwitchList from '@src/sections/shellies/shelly-switch-list';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';

interface ShellyProps {
  device: Device;
  handleSwitchToggle: (aSwitch: DeviceSwitch) => void;
  display: 'minimized' | 'maximized';
}
/**
 * Component to display the Shelly device
 * @param {object} device The device to display
 * @param {function} handleSwitchToggle handles the click / toggle of a switch
 * @param {string} display The display value for the sk tab. Can be 'minimized' or 'maximized'
 * @return {JSX.Element} The Shelly component with the image, name, generation and available switches
 */
const Shelly = ({ device, handleSwitchToggle, display }: ShellyProps): JSX.Element => {
  const [switches, setSwitches] = useState(device.switches);

  /**
    When a switch status changed, it must be changed in the device
    switches array. Doing this here rerenders the switch list and
    prevents a rerender of the whole Shelly component.
    @param {object} aSwitch The switch that was clicked / toggled
  */
  const handleSwitchClick = (aSwitch: DeviceSwitch) => {
    if (typeof aSwitch.index !== 'undefined') {
      aSwitch.output = !aSwitch.output;
      const newSwitches = [...switches];
      newSwitches[aSwitch.index] = aSwitch;
      setSwitches(newSwitches);

      // call the function of ShellyCard component.
      handleSwitchToggle(aSwitch);
    }
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          minHeight: 35,
          maxHeight: 35,
          pr: 1,
          pl: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <ShellyStatus online={device.online} />
        <ShellySwitchList switches={device.switches} handleSwitchClick={handleSwitchClick} />
      </Stack>
      <CardHeader
        title={
          <Link href={`http://${device.ip}`} target="_blank" color="inherit" underline="hover">
            {device.cname.substring(0, 14)}
          </Link>
        }
        subheader={`${device.name} ${device.gen > 0 ? `(Gen ${device.gen})` : ''}`}
        sx={{ minWidth: 200, minHeight: 50, maxHeight: 50, pt: 1, pb: 1 }}
      />
      {display === 'maximized' && (
        <CardMedia
          sx={{
            minWidth: 160,
            maxWidth: 160,
            minHeight: 120,
            objectFit: 'scale-down',
          }}
          image={device.image}
          title={device.name}
          component="img"
          alt={device.name}
        />
      )}
    </>
  );
};
export default Shelly;
