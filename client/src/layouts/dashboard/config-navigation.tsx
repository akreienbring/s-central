import SvgColor from '@src/components/svg-color';
import { type NavItem } from '@src/types/navigation';

// ----------------------------------------------------------------------

/**
 * Creates a SVG icon used for the nav bar from a given string
 * @param name  The name of the SVG icon to create
 * @returns
 */
const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig: NavItem[] = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
    minRole: 'User',
  },
  {
    title: 'shellies',
    path: '/shellies',
    icon: icon('ic_device'),
    minRole: 'User',
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
    minRole: 'User',
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
    minRole: 'Admin',
  },
];

export default navConfig;
