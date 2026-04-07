/*
  Author: André Kreienbring
  Presented for blogpost editing in the post-card
  When clicked a dialog is opened that holds the form to update an existing blogpost.
  UpdateBlogpost is used to create and update blogposts. 
  Hirarchy:
  BlogView
    |_CreateBlogpost | UpdateBlogpost
      |_BlogPostForm
        |_PostEditor
*/
import type { Blogpost } from '@src/types/blogpost';

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import BlogPostForm from './blogpost-form';

interface UpdateBlogpostProps {
  openUpdate: boolean;
  updatepost: Blogpost;
  onCloseUpdate: () => void;
  handleUpdatePost: (updatedBlogpost: Blogpost) => void;
}
/**
  A Drawer that displays the Blogpost form to update a post.
  @param  {UpdateBlogpostProps} props
  @param {boolean} props.openUpdate To determine if the update dialog is shown or not
  @param {Blogpost} props.updatepost The blogpost that will be updated.
  @param {Function} props.onCloseUpdate Handles the closed status
  @param {Function} props.handleUpdatePost Called when BlogView must rerender the post
*/
export default function UpdateBlogpost({
  openUpdate,
  updatepost,
  onCloseUpdate,
  handleUpdatePost,
}: UpdateBlogpostProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Drawer
      anchor="right"
      open={openUpdate}
      onClose={onCloseUpdate}
      slotProps={{
        paper: {
          sx: { width: 1, border: 'none', overflow: 'auto' },
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1, py: 2 }}
      >
        <Typography variant="h6" sx={{ ml: 1 }}>
          {t('_editpost_')}
        </Typography>
        <IconButton onClick={onCloseUpdate}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </Stack>

      <Divider />
      <BlogPostForm type="update" handleUpdatePost={handleUpdatePost} updatepost={updatepost} />
    </Drawer>
  );
}
