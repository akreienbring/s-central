import { Helmet } from 'react-helmet-async';

import { useShelly } from 'src/sccontext';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  const { user } = useShelly();
  return (
    <>
      <Helmet>
        <title> Dashboard</title>
      </Helmet>

      {user ? <AppView /> : null}
    </>
  );
}
