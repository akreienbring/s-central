/*
  Author: André Kreienbring
  If 'blogs' is configured as the landing page, then
  this component presents public posts on the langing page.
*/
import type { Blogpost } from '@src/types/blogpost';

import Logo from '@src/components/logo';
import { useNavigate } from 'react-router';
import Iconify from '@src/components/iconify';
import { useShelly } from '@src/hooks/use-shelly';
import PostCard from '@src/sections/blog/post-card';
import { createUUID, mapNumberToMax } from '@src/utils/general';
import { useRef, type JSX, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

/**
 * The LandingView presents public blogposts if they exist
 * If not the user is forwarded to the LoginView
 * @returns {JSX.Element}
 */
export default function LandingView(): JSX.Element {
  const [blogposts, setBlogposts] = useState<Blogpost[]>([]);
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
    (msg: SrvAnswerMsg) => {
      isBlogpostsLoaded.current = true;

      if (msg.data.blogposts && msg.data.blogposts.length > 0) {
        const allBlogposts: Blogpost[] = msg.data.blogposts.map(
          (blogpost, index) =>
            // add a chart color to the device that depends on its index in the array
            ({
              id: blogpost.blogpostid,
              cover: `/assets/images/covers/cover_${mapNumberToMax(index + 1, 24)}.jpg`,
              title: blogpost.title,
              content: blogpost.content,
              createdAt: blogpost.createdAt,
              author: {
                name: blogpost.alias,
                avatarUrl: `/assets/images/avatars/avatar_${mapNumberToMax(blogpost.userid, 25)}.jpg`,
              },
            }) as Blogpost
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
    if (!isBlogpostsLoaded.current) {
      const requestMsg: CliRequestMsg = {
        event: 'blogposts-get-public',
        source: 'LandingView',
        message: 'LandingView  needs the list of public blogposts',
        data: {},
      };
      request(requestMsg, handleBlogpostsReceived);
    }
  }, [handleBlogpostsReceived, request]);

  /**
   * Forward the user to the LoginView if the Login button is clicked
   */
  const handleLogin = () => {
    navigate(`/login`);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={10} sx={{ justifyContent: 'space-between' }}>
          <Logo sx={{ mt: 3 }} />
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Button
              data-testid="landing_login_button"
              color="inherit"
              variant="outlined"
              onClick={handleLogin}
              startIcon={<Iconify icon="eva:lock-fill" />}
              sx={{ mt: 3, width: 160 }}
            >
              Login
            </Button>
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
