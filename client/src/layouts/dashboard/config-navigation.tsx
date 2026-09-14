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
    title: 'Dashboard',
    dataTestId: 'nav_item_Dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
    minRole: 'User',
  },
  {
    title: 'Shellies',
    dataTestId: 'nav_item_Shellies',
    path: '/shellies',
    icon: icon('ic_device'),
    minRole: 'User',
  },
  {
    title: 'Blogs',
    dataTestId: 'nav_item_Blogs',
    path: '/blog',
    icon: icon('ic_blog'),
    minRole: 'User',
  },
  {
    title: 'Users',
    dataTestId: 'nav_item_Users',
    path: '/user',
    icon: icon('ic_user'),
    minRole: 'Admin',
  },
  {
    title: 'Rules',
    dataTestId: 'nav_item_Rules',
    path: '/rule',
    icon: icon('ic_rule'),
    minRole: 'Admin',
  },
];

export default navConfig;
