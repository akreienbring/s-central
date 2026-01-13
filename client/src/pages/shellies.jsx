import { Helmet } from 'react-helmet-async';

import { ShelliesView } from 'src/sections/shellies/view';

import { useShelly } from 'src/sccontext';

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
