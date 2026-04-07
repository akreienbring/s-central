/*
  Author: André Kreienbring
  The BlogPostForm is used to create and update blogposts. 
  Hirarchy:
  BlogView
    |_CreateBlogpost | UpdateBlogpost
      |_BlogPostForm
        |_PostEditor
*/
/*
  Author: André Kreienbring
  Renders the create and update form for blogposts
  depending on the passed in type property.
*/
import type { Blogpost } from '@src/types/blogpost';

import isEqual from 'lodash/isEqual';
import { type JSX, useState } from 'react';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import PostEditor from './post-editor';

interface BlogpostFormProps {
  type: 'create' | 'update';
  handleUpdatePost?: (updatedBlogpost: Blogpost) => void;
  updatepost?: Blogpost;
  handleBlogpostsReceived?: (msg: SrvAnswerMsg) => void;
}

/**
 * Component that displays a form to create or update a Blogpost
 * @param {BlogpostFormProps} props
 * @param {string} props.type The type of the form. Either 'create' or 'update'.
 * @param {Function} props.handleUpdatePost Called when a Blogpost must be updated.
 * @param {Blogpost} [props.updatepost] A post that will be updated
 * @param {Function} props.handleBlogpostsReceived Called when a list of blogposts arrives from the server
 */
const BlogpostForm = ({
  type,
  handleUpdatePost,
  updatepost,
  handleBlogpostsReceived,
}: BlogpostFormProps): JSX.Element => {
  const { user, request } = useShelly();
  const [currentBlogpost, setCurrentBlogpost] = useState<Blogpost>(
    type === 'update'
      ? (updatepost as Blogpost)
      : ({
          title: '',
          content: '',
          public: 0,
        } as Blogpost)
  );
  const { t } = useTranslation();
  const [requestResult, setRequestResult] = useState({ success: true, message: '' });

  /**
    Called when a 'blogpost create' message was received upon a former
    request that was send by 'handleSubmit'. The new list of blogposts is attached
    to the message
    @param {object} msg The message that was passed with the answer from the server
  */
  const handleBlogpostCreated = (msg: SrvAnswerMsg) => {
    const result = msg.data.requestResult;
    if (result) {
      setRequestResult({
        success: result.success,
        message: result.success ? t('_blogpostcreated_') : t('_blogpostnotcreated_'),
      } as RequestResult);

      // if successful: update the posts in Blogview
      if (result.success && typeof handleBlogpostsReceived !== 'undefined')
        handleBlogpostsReceived(msg);
    }
  };

  /**
    Called when a 'blogpost-update' message was received upon a former
    request that was send by 'handleSubmit'
    @param {object} msg The mesage that was passed with the answer from the server
  */
  const handleBlogpostUpdated = (msg: SrvAnswerMsg) => {
    const result = msg.data.requestResult;
    if (result) {
      setRequestResult({
        success: result.success,
        message: result.success ? t('_blogpostupdated_') : t('_blogpostnotupdated_'),
      } as RequestResult);

      // if successful: update the blogpost in BlogView
      if (result.success && typeof handleUpdatePost !== 'undefined')
        handleUpdatePost(currentBlogpost);
    }
  };

  /**
    All controlled inputs constantly keep the 'currentBlogpost'
    up to date. This way it can be directly submitted to 
    the server without collecting the form entries.
    The name of the input must match a blogpost attribute!
    @param {Event} e The change event of the input field that was changed
  */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedBlogpost = { ...currentBlogpost };
    if (e.target.name === 'public') {
      updatedBlogpost.public = e.target.checked ? 1 : 0;
    } else {
      // TODO: Find a way to do THIS dynamically with typescript!
      //updatedBlogpost[e.target.name] = e.target.value;
      if (e.target.name === 'title') updatedBlogpost[e.target.name] = e.target.value;
    }
    setCurrentBlogpost(updatedBlogpost);
  };

  /**
    Called everytime the content of the RichTextEditor changes.
    Adds the content to the current blogpost
    @param {string} content The HTML content of the editor.
  */
  const handleContentChange = (content: string) => {
    const updatedBlogpost = { ...currentBlogpost };
    updatedBlogpost.content = content;
    setCurrentBlogpost(updatedBlogpost);
  };

  /**
   * Called when the submit button for a blogpost was clicked.
   * Creates or updates a blogpost by communicating with the server
   * @param {Event} e The submit event of the form
   */
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === 'create') {
      const finalBlogpost = { ...currentBlogpost };
      finalBlogpost.userid = user!.userid;
      finalBlogpost.createdAt = Date.now();
      setCurrentBlogpost(finalBlogpost);

      // send the created user to the server
      const requestMsg: CliRequestMsg = {
        event: 'blogpost-create',
        source: 'Blogpost Form',
        message: 'Blogpost Form wants to create a new post',
        data: {
          blogpost: finalBlogpost,
        },
      };
      request(requestMsg, handleBlogpostCreated);
    } else if (type === 'update') {
      // send the updated blogpost to the server
      const requestMsg: CliRequestMsg = {
        event: 'blogpost-update',
        source: 'Blogpost Form',
        message: 'Blogpost Form wants to update a post',
        data: {
          blogpost: currentBlogpost,
        },
      };
      request(requestMsg, handleBlogpostUpdated);
    }
  };

  /**
   * Constantly checking if submit criterias are met.
   * @returns {boolean} True if the criterias are met, false otherwise
   */
  const checkSubmitCriterias = (): boolean =>
    typeof currentBlogpost.title === 'undefined' ||
    currentBlogpost.title.length === 0 ||
    typeof currentBlogpost.content === 'undefined' ||
    currentBlogpost.content.length === 0 ||
    isEqual(updatepost, currentBlogpost);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth>
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
          <PostEditor handleContentChange={handleContentChange} content={currentBlogpost.content} />
          <Typography variant="subtitle2" color={requestResult.success ? 'success' : 'error'}>
            {t(requestResult.message)}
          </Typography>
          <Button
            data-testid="blogpost_submit_button"
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
