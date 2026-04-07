import { Helmet } from 'react-helmet-async';
import { useShelly } from '@src/hooks/use-shelly';
import { ShelliesView } from '@src/sections/shellies/view';

// ----------------------------------------------------------------------
/**
 * The Shellies page
 * @returns
 */
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
