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
