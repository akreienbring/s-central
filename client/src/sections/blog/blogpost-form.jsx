/*
  Author: André Kreienbring
  Renders the create and update form for blogposts
  depending on the passed in type property.
*/
import { useState } from 'react';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useShelly } from 'src/sccontext';

import Iconify from 'src/components/iconify';

import BlogEditor from './post-editor';

/**
 * Component that displays a form to create or update a Blogpost
 * @param {string} type The type of the form. Either 'create' or 'update'.
 * @param {function} handleUpdatePost Called when a Blogpost must be updated.
 * @param {object} A post that will be updated
 * @param {function} handleBlogpostsReceived Called when a list of blogposts arrives from the server
 */
const BlogpostForm = ({ type, handleUpdatePost, updatepost, handleBlogpostsReceived }) => {
  const { user, request } = useShelly();
  const [currentBlogpost, setCurrentBlogpost] = useState(
    type === 'update'
      ? updatepost
      : {
          title: '',
          content: '',
          public: 0,
        }
  );
  const { t } = useTranslation();
  const [requestResult, setRequestResult] = useState({ success: true, message: '' });

  /**
    Called when a 'blogpost create' message was received upon a former
    request that was send by 'handleSubmit'. The new list of blogposts is attached
    to the message
    @param {object} msg The message that was passed with the answer from the server
  */
  const handleBlogpostCreate = (msg) => {
    setRequestResult({
      success: msg.data.success,
      message: msg.data.message,
    });
    // if successful: update the posts in Blogview
    if (msg.data.success) handleBlogpostsReceived(msg);
  };

  /**
    Called when a 'blogpost update' message was received upon a former
    request that was send by 'handleSubmit'
    @param {object} msg The mesage that was passed with the answer from the server
  */
  const handleBlogpostUpdate = (msg) => {
    setRequestResult({
      success: msg.data.success,
      message: msg.data.message,
    });
    // if successful: update the blogpost in BlogView
    if (msg.data.success) handleUpdatePost(currentBlogpost);
  };

  /**
    All controlled inputs constantly keep the 'currentBlogpost'
    up to date. This way it can be directly submitted to 
    the server without collecting the form entries.
    The name of the input must match a blogpost attribute!
    @param {object} target The input field that was changed
  */
  const handleInputChange = ({ target }) => {
    const updatedBlogpost = { ...currentBlogpost };
    if (target.name === 'public') {
      updatedBlogpost.public = target.checked ? 1 : 0;
    } else {
      updatedBlogpost[target.name] = target.value;
    }
    setCurrentBlogpost(updatedBlogpost);
  };

  /**
    Called everytime the content of the RichTextEditor changes.
    Adds the content to the current blogpost
    @param {string} content The HTML content of the editor.
  */
  const handleContentChange = (content) => {
    const updatedBlogpost = { ...currentBlogpost };
    updatedBlogpost.content = content;
    setCurrentBlogpost(updatedBlogpost);
  };

  /**
   * Called when the submit button was clicked.
   * Creates or updates a blogpost by communicating with the server
   * @param {object} event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'create') {
      currentBlogpost.userid = user.userid;
      currentBlogpost.createdAt = Date.now();

      // send the created user to the server
      const msg = {
        event: 'blogpost create',
        data: {
          source: 'Blogpost Form',
          message: 'Blogpost Form wants to create a new post',
          blogpost: currentBlogpost,
        },
      };
      request(msg, handleBlogpostCreate);
    } else if (type === 'update') {
      // send the updated blogpost to the server
      const msg = {
        event: 'blogpost update',
        data: {
          source: 'Blogpost Form',
          message: 'Blogpost Form wants to update a post',
          blogpost: currentBlogpost,
        },
      };
      request(msg, handleBlogpostUpdate);
    }
  };

  /**
   * Constantly checking if submit criterias are met.
   * @returns {boolean} True if the criterias are met, false otherwise
   */
  const checkSubmitCriterias = () =>
    typeof currentBlogpost.title === 'undefined' ||
    currentBlogpost.title.length === 0 ||
    typeof currentBlogpost.content === 'undefined' ||
    currentBlogpost.content.length === 0 ||
    isEqual(updatepost, currentBlogpost);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth size="subtitle2">
        <Stack spacing={3} sx={{ px: 3, py: 3 }}>
          <Stack direction="row" spacing={3}>
            <TextField
              required
              value={currentBlogpost.title}
              name="title"
              label={t('Title')}
              slotProps={{ htmlInput: { 'data-testid': 'blogpost_title_input', maxLength: 40 } }}
              onChange={handleInputChange}
              sx={{ width: 280 }}
            />
            <FormControlLabel
              control={
                <Switch
                  name="public"
                  size="medium"
                  checked={currentBlogpost.public === 1}
                  onChange={handleInputChange}
                />
              }
              label="Public"
              labelPlacement="bottom"
            />
          </Stack>
          <BlogEditor handleContentChange={handleContentChange} content={currentBlogpost.content} />
          <Typography variant="subtitle2" color={requestResult.success ? 'success' : 'error'}>
            {t(requestResult.message)}
          </Typography>
          <Button
            disabled={checkSubmitCriterias()}
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="formkit:submit" />}
          >
            {t('Save')}
          </Button>
        </Stack>
      </FormControl>
    </form>
  );
};

export default BlogpostForm;
