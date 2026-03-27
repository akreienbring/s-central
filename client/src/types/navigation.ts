import type { JSX } from 'react';

export type NavItem = {
  title: string;
  path: string;
  icon: JSX.Element;
  minRole: string;
};
