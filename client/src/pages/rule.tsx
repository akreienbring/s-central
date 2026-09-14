import { Helmet } from 'react-helmet-async';
import { useShelly } from '@src/hooks/use-shelly';
import { RuleView } from '@src/sections/rules/view';

// ----------------------------------------------------------------------

/**
 * The Rules page
 * @returns
 */
export default function BlogPage() {
  const { user } = useShelly();

  return (
    <>
      <Helmet>
        <title> Rules</title>
      </Helmet>

      {user ? <RuleView /> : null}
    </>
  );
}
