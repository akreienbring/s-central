import { Helmet } from 'react-helmet-async';

import { useShelly } from 'src/sccontext';

import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

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
