import { Helmet } from 'react-helmet-async';
import { useShelly } from '@src/hooks/use-shelly';
import { AppView } from '@src/sections/overview/view';

// ----------------------------------------------------------------------

/**
 * The Dashboard Page
 * @returns
 */
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
