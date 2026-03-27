import { type JSX } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
interface SvgColorProps {
  color?: string;
  src: string;
  width?: number;
  height?: number;
  sx?: object;
}

const SvgColor = ({ src, sx, ...other }: SvgColorProps): JSX.Element => (
  <Box
    component="span"
    className="svg-color"
    sx={{
      width: 24,
      height: 24,
      display: 'inline-block',
      bgcolor: 'currentColor',
      mask: `url(${src}) no-repeat center / contain`,
      WebkitMask: `url(${src}) no-repeat center / contain`,
      ...sx,
    }}
    {...other}
  />
);

export default SvgColor;
