import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
interface IconifyProps {
  icon: string;
  width?: number;
  height?: number;
  sx?: object;
  color?: string;
  className?: string;
}

/**
 * Display an Iconify icon
 * @param {IconifyProps} props
 * @param {string} props.icon The name of the icon
 * @param {number} [props.width] The width of the icon. Defaults to 25
 * @param {string} [props.color] The color of the icon
 * @param {string} [props.className] A css classname to apply
 * @param {object} [props.sx] A MUI styling to apply
 * @returns
 */
const Iconify = ({ icon, width = 25, sx, ...other }: IconifyProps) => (
  <Box
    component={Icon}
    className="component-iconify"
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
);

export default Iconify;
