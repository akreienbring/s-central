import { Helmet } from 'react-helmet-async';

import { BlogView } from 'src/sections/blog/view';

import { useShelly } from 'src/sccontext';

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
