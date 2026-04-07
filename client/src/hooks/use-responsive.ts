import { useTheme } from '@mui/material/styles';
import type { Breakpoint } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

/**
 * A hook that uses a media query to implement a responsive design
 * @param {string} query
 * @param {Breakpoint} start
 * @param {Breakpoint} end
 * @returns
 */
export function useResponsive(query: string, start: Breakpoint, end?: Breakpoint) {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(start));

  const mediaDown = useMediaQuery(theme.breakpoints.down(start));

  const mediaBetween = useMediaQuery(theme.breakpoints.between(start, end ?? 'xl'));

  const mediaOnly = useMediaQuery(theme.breakpoints.only(start));

  if (query === 'up') {
    return mediaUp;
  }

  if (query === 'down') {
    return mediaDown;
  }

  if (query === 'between') {
    return mediaBetween;
  }

  return mediaOnly;
}
