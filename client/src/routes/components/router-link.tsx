import type { JSX } from 'react';
import type { LinkProps } from 'react-router';

import { Link } from 'react-router';

// ----------------------------------------------------------------------

interface RouterLinkProps extends Omit<LinkProps, 'to'> {
  href: string;
  ref?: React.RefObject<HTMLAnchorElement | null>;
}

/**
 * A link that can be used for routing
 * @param {RouterLinkProps} props
 * @param {string} props.href The Link
 * @param {React.RefObject} [props.ref] A react ref object
 * @returns
 */
export default function RouterLink({ href, ref, ...other }: RouterLinkProps): JSX.Element {
  return <Link ref={ref} to={href} {...other} />;
}
