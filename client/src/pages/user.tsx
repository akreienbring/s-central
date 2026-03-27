import { Helmet } from 'react-helmet-async';
import { useShelly } from '@src/hooks/use-shelly';
import { UserView } from '@src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  const { user } = useShelly();

  return (
    <>
      <Helmet>
        <title> User</title>
      </Helmet>

      {user ? <UserView /> : null}
    </>
  );
}
