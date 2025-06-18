/*
  Author: André Kreienbring
  If 'blogs' is configured as the landing page, then
  this component presents public posts on the langing page.
*/
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { createUUID, mapNumberToMax } from 'src/utils/general';

import { useShelly } from 'src/sccontext';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import PostCard from 'src/sections/blog/post-card';

export default function LandingView() {
  const [blogposts, setBlogposts] = useState([]);
  const { request } = useShelly();
  const isBlogpostsLoaded = useRef(false);
  const navigate = useNavigate();

  /**
    Called when BlogView is mounted and all blogposts
    are received from the server.
    Presents existing blogposts. If there are not blogpost
    the loging page is presented.
    @param {object} msg with an array ob existing blog posts
    the loging page is presented.
  */
  const handleBlogpostsReceived = useCallback(
    (msg) => {
      isBlogpostsLoaded.current = true;

      if (msg.data.blogposts.length > 0) {
        const allBlogposts = msg.data.blogposts.map((blogpost, index) =>
          // add a chart color to the device that depends on its index in the array
          ({
            id: blogpost.blogpostid,
            cover: `/assets/images/covers/cover_${mapNumberToMax(index + 1, 24)}.jpg`,
            title: blogpost.title,
            content: blogpost.content,
            createdAt: blogpost.createdAt,
            view: 23,
            comment: 45,
            share: 45,
            favorite: 5,
            author: {
              name: blogpost.alias,
              avatarUrl: `/assets/images/avatars/avatar_${mapNumberToMax(blogpost.userid, 25)}.jpg`,
            },
          })
        );

        setBlogposts(allBlogposts);
      } else {
        navigate(`/login`);
      }
    },
    [setBlogposts, navigate]
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
          event: 'blogposts get public',
          data: {
            name: 'LandingView',
            message: 'LandingView  needs the list of public blogposts',
          },
        },
        handleBlogpostsReceived
      );
  }, [handleBlogpostsReceived, request]);

  const handleLogin = () => {
    navigate(`/login`);
  };

  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={10} sx={{ justifyContent: 'space-between' }}>
          <Logo sx={{ mt: 3 }} />
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <IconButton onClick={handleLogin} sx={{ pt: 3 }} aria-label="Login">
              <Iconify icon="eva:lock-fill" />
              <Typography variant="h6">Login</Typography>
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ pt: 5 }}>
        {blogposts.map((blogpost, index) => (
          <PostCard key={createUUID()} blogpost={blogpost} index={index} />
        ))}
      </Grid>
    </Container>
  );
}
