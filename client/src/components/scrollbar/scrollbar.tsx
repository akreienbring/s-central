import { memo } from 'react';

import Box from '@mui/material/Box';

import { StyledScrollbar, StyledRootScrollbar } from './styles';

// ----------------------------------------------------------------------
interface ScrollbarProps {
  children: React.ReactNode;
  sx?: object;
}

/**
 * Provides components with a scrollbar
 * @param {ScrollbarProps} props
 * @param {React.ReactNode} props.children
 * @param {object} [props.sx] for styling the scrollbar
 * @returns
 */
const Scrollbar = ({ children, sx, ...other }: ScrollbarProps) => {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (mobile) {
    return (
      <Box sx={{ overflow: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <StyledRootScrollbar>
      <StyledScrollbar clickOnTrack={false} sx={sx} {...other}>
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
};

export default memo(Scrollbar);
