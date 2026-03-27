/*
  Author: André Kreienbring
  Types for presenting users in the UserView and
  various forms / dialogs.
*/
export type User = {
  userid: number;
  alias: string;
  role: 'Admin' | 'User' | 'Blogger';
  roleid: number;
  email: string;
  password?: string;
  password2?: string;
  firstname: string;
  lastname: string;
  home: UserHome;
  istest?: boolean;
  avatarUrl?: string;
  uuid?: string;
};

export type UserFormType = 'login' | 'profile' | 'security' | 'settings' | 'create';
export type UserRole = 'Admin' | 'User' | 'Blogger';
export type UserHome = 'dashboard' | 'shellies';
