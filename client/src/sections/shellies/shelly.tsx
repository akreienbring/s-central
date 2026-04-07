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

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import CardActionArea from '@mui/material/CardActionArea';

interface ShellyProps {
  device: Device;
  handleSwitchToggle: (aSwitch: DeviceSwitch) => void;
  handleToggleSelection: (deviceId: string) => void;
  tab: string;
  display: 'minimized' | 'maximized';
}
/**
 * Component to display the Shelly device and it's switches
 * @param {ShellyProps} props
 * @param {object} props.device The device to display
 * @param {Function} props.handleSwitchToggle handles the click / toggle of a switch
 * @param {Function} props.handleToggleSelection handles the selection / dese of a device
   @param {string} props.tab The current tab panel to show. Can be:
   'sk': script/kvs 
   'ws': websocket messages from a shelly device
   'log': log messages
   'ctrl': controls of a shelly device
* @param {string} props.display The display value for the sk tab. Can be 'minimized' or 'maximized'
 * @return {JSX.Element} The Shelly component with the image, name, generation and available switches
 */
const Shelly = ({
  device,
  handleSwitchToggle,
  handleToggleSelection,
  tab,
  display,
}: ShellyProps): JSX.Element => {
  const [switches, setSwitches] = useState(device.switches);

  /**
    When a switch status changed, it must be changed in the device
    switches array. Doing this here rerenders the switch list and
    prevents a rerender of the whole Shelly component.
    @param {object} aSwitch The switch that was clicked / toggled
  */
  const handleSwitchClick = (aSwitch: DeviceSwitch) => {
    if (aSwitch) {
      aSwitch.output = !aSwitch.output;
      const newSwitches = [...switches];
      newSwitches[aSwitch.id] = aSwitch;
      setSwitches(newSwitches);

      // call the function of ShellyCard component.
      handleSwitchToggle(aSwitch);
    }
  };

  /**
   * Render the top part of the Shelly component, which includes the name, generation and image of the device.
   */
  const renderTop = () => (
    <>
      <CardHeader
        title={
          <Link href={`http://${device.ip}`} target="_blank" color="inherit" underline="hover">
            {device.cname.substring(0, 14)}
          </Link>
        }
        subheader={`${device.name} ${device.gen > 0 ? `(Gen ${device.gen})` : ''}`}
        sx={{ minHeight: 50, maxHeight: 50, pt: 1, pb: 1, minWidth: 190 }}
      />
      {display === 'maximized' && (
        <CardMedia
          sx={{
            width: 160,
            maxHeight: 120,
            ml: 2,
            objectFit: 'scale-down',
          }}
          image={device.image}
          component="img"
        />
      )}
    </>
  );

  return (
    <>
      <Stack
        direction="row"
        sx={{
          minHeight: 35,
          maxHeight: 35,
          pr: 1,
          pl: 1,
          justifyContent: 'space-between',
        }}
      >
        <ShellyStatus online={device.online} />
        <ShellySwitchList switches={device.switches} handleSwitchClick={handleSwitchClick} />
      </Stack>

      <Box sx={{ alignItems: 'center', justifyContent: 'center' }}>
        {tab === 'sk' || tab === 'ctrl' ? (
          <CardActionArea
            data-testid={`action_area_${device.cname}`}
            component="div"
            onClick={() => handleToggleSelection(device.id)}
          >
            {renderTop()}
          </CardActionArea>
        ) : (
          renderTop()
        )}
      </Box>
    </>
  );
};
export default Shelly;
