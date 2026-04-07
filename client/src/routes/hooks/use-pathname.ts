import { useMemo } from 'react';
import { useLocation } from 'react-router';

// ----------------------------------------------------------------------

/**
 * A hook to use the location as a pathname
 * @returns
 */
export function usePathname() {
  const { pathname } = useLocation();

  return useMemo(() => pathname, [pathname]);
}
