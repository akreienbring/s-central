import { forwardRef } from 'react';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

const Iconify = forwardRef(({ icon, width = 25, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    className="component-iconify"
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
));

export default Iconify;
