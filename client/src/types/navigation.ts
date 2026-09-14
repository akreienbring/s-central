import type { JSX } from 'react';

export type NavItem = {
  title: string;
  dataTestId: string;
  path: string;
  icon: JSX.Element;
  minRole: string;
};
