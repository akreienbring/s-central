import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TextEditorReadOnly } from 'mui-tiptap-editor';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fDate } from 'src/utils/format-time';

import { useShelly } from 'src/sccontext';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

import UpdateBlogpost from './update-blogpost';

// ----------------------------------------------------------------------

export default function PostCard({ blogpost, index, handleDeletePost }) {
  const [openMenue, setOpenMenue] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openContent, setOpenContent] = useState(false);

  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const [currentBlogpost, setCurrentBlogpost] = useState(blogpost);
  const { t } = useTranslation();
  const { user } = useShelly();

  // this defines different shapes of the PostCard
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;

  /*
    Called when a post was updated. Updates the
    list of blogposts.
    @param {object} formpost The post that was updated using the form
  */
  const handleUpdatePost = (formpost) => {
    const updatedPost = { ...currentBlogpost };
    updatedPost.title = formpost.title;
    updatedPost.content = formpost.content;
    updatedPost.public = formpost.public;

    setCurrentBlogpost(updatedPost);
  };

  // Open / Close the action menue
  const handleOpenMenu = (e) => {
    setOpenMenue(e.currentTarget);
    setShowReallyDelete(false);
  };
  const handleCloseMenu = () => {
    setOpenMenue(null);
  };

  // Open / Close the BlogpostUpdate Dialog
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };
  const handleOpenUpdate = () => {
    setOpenUpdate(true);
    setOpenMenue(null);
  };

  const handleShowReally = () => {
    setShowReallyDelete(true);
  };

  const renderAvatar = (
    <Avatar
      alt={currentBlogpost.author.name}
      src={currentBlogpost.author.avatarUrl}
      sx={{
        zIndex: 9,
        width: 32,
        height: 32,
        position: 'absolute',
        left: (theme) => theme.spacing(3),
        bottom: (theme) => theme.spacing(-2),
        ...((latestPostLarge || latestPost) && {
          zIndex: 9,
          top: 24,
          left: 24,
          width: 40,
          height: 40,
        }),
      }}
    />
  );

  const renderPost = (
    <Box
      sx={
        latestPostLarge || latestPost
          ? {
              position: 'absolute',
              top: 80,
              left: 25,
            }
          : { pl: 3, pt: 4 }
      }
    >
      <Stack>
        <Typography
          variant="caption"
          component="div"
          sx={{
            mb: 2,
            color: 'text.disabled',
            ...((latestPostLarge || latestPost) && {
              opacity: 0.48,
              color: 'common.white',
            }),
          }}
        >
          {fDate(currentBlogpost.createdAt)}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Typography
            color="inherit"
            variant="subtitle2"
            sx={{
              height: 44,
              overflow: 'hidden',
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              ...(latestPostLarge && { typography: 'h5', height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
            }}
          >
            {currentBlogpost.title}
          </Typography>
          <Iconify
            icon="mdi:text-box"
            onClick={() => setOpenContent(!openContent)}
            sx={{
              cursor: 'pointer',
              ...((latestPostLarge || latestPost) && {
                color: 'white',
              }),
            }}
          />
        </Stack>
        <Typography
          variant="caption"
          color="inherit"
          sx={{
            ...((latestPostLarge || latestPost) && {
              color: 'common.white',
            }),
          }}
        >
          <TextEditorReadOnly
            value={`${currentBlogpost.content.substring(0, 150)} ${currentBlogpost.content.length > 150 ? '...' : ''}`}
          />
        </Typography>
      </Stack>
    </Box>
  );

  const renderCover = (
    <Box
      component="img"
      alt={currentBlogpost.title}
      src={currentBlogpost.cover}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderShape = (
    <SvgColor
      color="paper"
      src="/assets/icons/shape-avatar.svg"
      sx={{
        width: 80,
        height: 36,
        zIndex: 9,
        bottom: -15,
        position: 'absolute',
        color: 'background.paper',
        ...((latestPostLarge || latestPost) && { display: 'none' }),
      }}
    />
  );

  return (
    <Grid
      size={
        !openContent
          ? { xs: 12, sm: latestPostLarge ? 12 : 6, md: latestPostLarge ? 6 : 3 }
          : { xs: 12, sm: 12, md: 12 }
      }
    >
      <Card>
        <Box
          sx={{
            position: 'relative',
            pt: 'calc(100% * 3 / 4)',
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          {user !== null && user.roleid < 3 && (
            <IconButton
              onClick={handleOpenMenu}
              sx={{
                zIndex: 9,
                position: 'absolute',
                top: 24,
                right: 20,
                width: 40,
                height: 40,
              }}
            >
              <Iconify icon="eva:more-vertical-fill" color="white" />
            </IconButton>
          )}
          {renderShape}

          {renderAvatar}
          {renderCover}
        </Box>
        {renderPost}
      </Card>
      {openContent && (
        <Box
          sx={{
            m: 3,
            display: 'flex',
            width: 1,
            overflowX: 'auto',
            overflowY: 'auto',
          }}
        >
          <TextEditorReadOnly value={currentBlogpost.content} />
        </Box>
      )}
      {user !== null && user.roleid < 3 && (
        <Popover
          open={!!openMenue}
          anchorEl={openMenue}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: { width: 200 },
            },
          }}
        >
          <MenuItem onClick={handleOpenUpdate}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            {t('Edit')}
          </MenuItem>

          {!showReallyDelete && (
            <MenuItem onClick={handleShowReally} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
              {t('Delete')}
            </MenuItem>
          )}

          {showReallyDelete && (
            <MenuItem onClick={handleDeletePost} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:question-mark-circle-outline" sx={{ mr: 2 }} />
              {t('_reallydelete_')}
            </MenuItem>
          )}
        </Popover>
      )}
      <UpdateBlogpost
        title={t('_editpost_')}
        openUpdate={openUpdate}
        type="update"
        updatepost={currentBlogpost}
        onCloseUpdate={handleCloseUpdate}
        handleUpdatePost={handleUpdatePost}
      />
    </Grid>
  );
}

PostCard.propTypes = {
  blogpost: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  handleDeletePost: PropTypes.func,
};
