import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router';

import { useShelly } from 'src/sccontext';
import DashboardLayout from 'src/layouts/dashboard';

const AppPage = lazy(() => import('src/pages/app'));
const BlogPage = lazy(() => import('src/pages/blog'));
const UserPage = lazy(() => import('src/pages/user'));
const LoginPage = lazy(() => import('src/pages/login'));
const LandingPage = lazy(() => import('src/pages/landing'));
const ShelliesPage = lazy(() => import('src/pages/shellies'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useShelly();

  const routes = useRoutes([
    {
      path: '/',
      element: window.scconfig.LANDING_PAGE === 'login' ? <LoginPage /> : <LandingPage />,
    },
    {
      // only if logged in
      element: user ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/" replace />
      ),
      children:
        // only if admin or no user (needed for correct logout behavior)
        !user || user.roleid === 1
          ? [
              { path: 'dashboard', element: <AppPage />, index: true },
              { path: 'user', element: <UserPage /> },
              { path: 'shellies', element: <ShelliesPage /> },
              { path: 'blog', element: <BlogPage /> },
            ]
          : [
              { path: 'dashboard', element: <AppPage />, index: true },
              { path: 'shellies', element: <ShelliesPage /> },
              { path: 'blog', element: <BlogPage /> },
            ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
