/*
  Author: André Kreienbring
  Presented as a Button in the Blog view. When clicked a Drawer is opened
  that holds the form to create a new blogpost.
*/

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import BlogPostForm from './blogpost-form';

/**
  @param {boolean} openCreate To determine if the dialog is shown or not
  @param {function} onOpenCreate Handles the open status
  @param {function} onCloseCreate Handles the closed status
  @param {function} handleBlogpostsReceived Will be passed to the UserForm to update
    the list of all users
*/
export default function CreateBlogpost({
  openCreate,
  onOpenCreate,
  onCloseCreate,
  handleBlogpostsReceived,
}) {
  const { t } = useTranslation();

  return (
    <>
      <Button
        data-testid="blog_newblog_button"
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={onOpenCreate}
      >
        {t('_newpost_')}
      </Button>
      <Drawer
        anchor="right"
        open={openCreate}
        onClose={onCloseCreate}
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
            {t('_newpost_')}
          </Typography>
          <IconButton data-testid="blogpost_close_button" onClick={onCloseCreate}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />
        <BlogPostForm type="create" handleBlogpostsReceived={handleBlogpostsReceived} />
      </Drawer>
    </>
  );
}

CreateBlogpost.propTypes = {
  openCreate: PropTypes.bool.isRequired,
  onOpenCreate: PropTypes.func.isRequired,
  onCloseCreate: PropTypes.func.isRequired,
  handleBlogpostsReceived: PropTypes.func.isRequired,
};
