/*
  Author: André Kreienbring
  Presented for blogpost editing in the post-card
  When clicked a dialog is opened that holds the form to update an existing user.
*/

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import BlogPostForm from './blogpost-form';

/*
  @param {boolean} openUpdate To determine if the update dialog is shown or not
  @param {object} updatepost The blogpost that will be updated.
  @param {function} onCloseUpdate Handles the closed status. Either in the 
    UserView / UserTableRow. Or in the
    AccountPopover component
  @param {function} handleUpdatePost Called when BlogView must rerender the user in the list
*/
export default function UpdateBlogpost({
  openUpdate,
  updatepost,
  onCloseUpdate,
  handleUpdatePost,
}) {
  const { t } = useTranslation();

  return (
    <Drawer
      anchor="right"
      open={openUpdate}
      onClose={onCloseUpdate}
      PaperProps={{
        sx: { width: 1, border: 'none', overflow: 'auto' },
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

UpdateBlogpost.propTypes = {
  openUpdate: PropTypes.bool.isRequired,
  updatepost: PropTypes.object,
  handleUpdatePost: PropTypes.func,
  onCloseUpdate: PropTypes.func.isRequired,
};
