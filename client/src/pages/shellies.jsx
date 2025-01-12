import { Helmet } from 'react-helmet-async';

import { useShelly } from 'src/sccontext';

import { ShelliesView } from 'src/sections/shellies/view';

// ----------------------------------------------------------------------

export default function ShelliesPage() {
  const { user } = useShelly();

  return (
    <>
      <Helmet>
        <title> Shellies</title>
      </Helmet>
      {user ? <ShelliesView /> : null}
    </>
  );
}
