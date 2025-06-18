/*
  Main view for the Blog Posts
*/
import { useRef, useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { createUUID, mapNumberToMax } from 'src/utils/general';

import { useShelly } from 'src/sccontext';

import PostCard from '../post-card';
import CreateBlogpost from '../create-blogpost';

// ----------------------------------------------------------------------

export default function BlogView() {
  const [blogposts, setBlogposts] = useState([]);
  const { request, user } = useShelly();
  const isBlogpostsLoaded = useRef(false);
  const [openCreate, setOpenCreate] = useState(false);

  /**
    Called when BlogView is mounted and all blogposts
    are received from the server.
    @param {object} msg with an array ob existing blog posts
  */
  const handleBlogpostsReceived = useCallback(
    (msg) => {
      isBlogpostsLoaded.current = true;

      const allBlogposts = msg.data.blogposts.map((blogpost, index) => ({
        id: blogpost.blogpostid,
        cover: `/assets/images/covers/cover_${mapNumberToMax(index + 1, 24)}.jpg`,
        title: blogpost.title,
        content: blogpost.content,
        createdAt: blogpost.createdAt,
        public: blogpost.public,
        author: {
          name: blogpost.alias,
          avatarUrl: `/assets/images/avatars/avatar_${mapNumberToMax(blogpost.userid, 25)}.jpg`,
        },
      }));

      setBlogposts(allBlogposts);
    },
    [setBlogposts]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    After creation of the page all blogposts are requested from the websocket server.
    The useEffect is only triggered once and lives as long the page is mounted.
  */
  useEffect(() => {
    if (!isBlogpostsLoaded.current)
      request(
        {
          event: 'blogposts get all',
          data: {
            source: 'Blog View',
            message: 'Blog View  needs the list of blogposts',
          },
        },
        handleBlogpostsReceived
      );
  }, [handleBlogpostsReceived, request]);

  // Open / Close the BlogpostCreate Dialog
  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  /**
    Called from the PostCard component when a post
    must be deleted. Send a message to the server.
    @param {number} id The id of the blogpost that must be deleted
  */
  const handleDeletePost = (id) => {
    request(
      {
        event: 'blogpost delete',
        data: {
          source: 'Blog View',
          message: 'Blog View wants to delete a post',
          ids: [id],
        },
      },
      handleBlogpostsReceived
    );
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Blog</Typography>
        {user.roleid < 3 && (
          <CreateBlogpost
            openCreate={openCreate}
            onOpenCreate={handleOpenCreate}
            onCloseCreate={handleCloseCreate}
            handleBlogpostsReceived={handleBlogpostsReceived}
          />
        )}
      </Stack>

      <Grid container spacing={3}>
        {blogposts.map((blogpost, index) => (
          <PostCard
            key={createUUID()}
            blogpost={blogpost}
            index={index}
            handleDeletePost={(event) => handleDeletePost(blogpost.id)}
          />
        ))}
      </Grid>
    </Container>
  );
}
