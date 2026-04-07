import { Helmet } from 'react-helmet-async';
import { LoginView } from '@src/sections/login';

// ----------------------------------------------------------------------

/**
 * The login page
 * @returns
 */
export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login</title>
      </Helmet>

      <LoginView />
    </>
  );
}
