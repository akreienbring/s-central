import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
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
