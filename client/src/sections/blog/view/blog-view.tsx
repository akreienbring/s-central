/*
  Main view for the Blog Posts
*/
import type { Blogpost } from '@src/types/blogpost';

import { useShelly } from '@src/hooks/use-shelly';
import { createUUID, mapNumberToMax } from '@src/utils/general';
import { useRef, type JSX, useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import PostCard from '../post-card';
import CreateBlogpost from '../create-blogpost';

// ----------------------------------------------------------------------

export default function BlogView(): JSX.Element {
  const [blogposts, setBlogposts] = useState<Blogpost[]>([]);
  const { request, user } = useShelly();
  const isBlogpostsLoaded = useRef(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  /**
    Called when BlogView is mounted and all blogposts
    are received from the server.
    @param {object} msg with an array ob existing blog posts
  */
  const handleBlogpostsReceived = useCallback(
    (msg: SrvAnswerMsg) => {
      isBlogpostsLoaded.current = true;

      if (typeof msg.data.blogposts !== 'undefined') {
        const allBlogposts: Blogpost[] = msg.data.blogposts.map(
          (blogpost, index) =>
            ({
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
            }) as Blogpost
        );

        setBlogposts(allBlogposts);
      }
    },
    [setBlogposts]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    After creation of the page all blogposts are requested from the websocket server.
    The useEffect is only triggered once and lives as long the page is mounted.
  */
  useEffect(() => {
    if (!isBlogpostsLoaded.current) {
      const requestMsg: CliRequestMsg = {
        event: 'blogposts-get-all',
        source: 'Blog View',
        message: 'Blog View  needs the list of blogposts',
        data: {},
      };
      request(requestMsg, handleBlogpostsReceived);
    }
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
  const handleDeletePost = (id: number) => {
    const requestMsg: CliRequestMsg = {
      event: 'blogpost-delete',
      source: 'Blog View',
      message: 'Blog View wants to delete a post',
      data: {
        ids: [id],
      },
    };
    request(requestMsg, handleBlogpostsReceived);
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Blog</Typography>
        {user!.roleid < 3 && (
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
            handleDeletePost={() => handleDeletePost(blogpost.id)}
          />
        ))}
      </Grid>
    </Container>
  );
}
