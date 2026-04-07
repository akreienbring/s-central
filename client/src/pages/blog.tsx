import { Helmet } from 'react-helmet-async';
import { useShelly } from '@src/hooks/use-shelly';
import { BlogView } from '@src/sections/blog/view';

// ----------------------------------------------------------------------

/**
 * The Blog page
 * @returns
 */
export default function BlogPage() {
  const { user } = useShelly();

  return (
    <>
      <Helmet>
        <title> Blog</title>
      </Helmet>

      {user ? <BlogView /> : null}
    </>
  );
}
