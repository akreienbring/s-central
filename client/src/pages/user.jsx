import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/user/view';

import { useShelly } from 'src/sccontext';

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
