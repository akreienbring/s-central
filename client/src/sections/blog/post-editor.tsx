/*
  Author: André Kreienbring
  Implementation of https://github.com/tiavina-mika/mui-tiptap-editor
  Example: https://codesandbox.io/s/github/tiavina-mika/mui-tiptap-editor-demo
  Used for creating and updating the contents of blogposts.
*/
import { type JSX } from 'react';
import { TextEditor } from 'mui-tiptap-editor';
import { useTranslation } from 'react-i18next';

interface PostEditorProps {
  handleContentChange: (content: string) => void;
  content: string;
}

/**
 * Component that displays the mui-tiptap-editor
 * @param {function} handleContentChange Every change is reported to keep the post up-to-date
 * @param {string}  content The initial content of the editor
 */
export default function PostEditor({ handleContentChange, content }: PostEditorProps): JSX.Element {
  const { t } = useTranslation();

  /*
    Label translation for the editor.
  */
  const customLabels = {
    editor: {
      editor: 'Editor',
      preview: t('_editor-preview_'),
    },
    toolbar: {
      bold: t('_editor-bold_'),
      italic: t('_editor-italic_'),
      strike: t('_editor-strike_'),
      underline: t('_editor-underline_'),
      link: t('_editor-link_'),
      bulletList: t('_editor-bulletlist_'),
      orderedList: t('_editor-orderedlist_'),
      alignLeft: t('_editor-alignleft_'),
      alignCenter: t('_editor-aligncenter_'),
      alignRight: t('_editor-alignright_'),
      alignJustify: t('_editor-alignjustify_'),
      blockquote: t('_editor-blockquote_'),
      codeBlock: t('_editor-codeblock_'),
      color: t('_editor-color_'),
      undo: t('_editor-undo_'),
      redo: t('_editor-redo_'),
    },
    headings: {
      normalText: t('_editor-normaltext_'),
      h1: t('_editor-h1_'),
      h2: t('_editor-h2_'),
      h3: t('_editor-h3_'),
      h4: t('_editor-h4_'),
      h5: t('_editor-h5_'),
      h6: t('_editor-h6_'),
    },
  };

  /* valid toolbar items as of 2.0.2
  [
    'heading',
    'bold',
    'italic',
    'strike',
    'link',
    'underline',
    'image',
    'code',
    'orderedList',
    'bulletList',
    'align',
    'codeBlock',
    'blockquote',
    'table',
    'history',
    'youtube',
    'color',
    'mention',
  ];
*/
  const toolbar = [
    'heading',
    'bold',
    'italic',
    'strike',
    'link',
    'underline',
    'code',
    'orderedList',
    'bulletList',
    'align',
    'codeBlock',
    'blockquote',
    'table',
    'history',
    'color',
  ];

  return (
    <div>
      <TextEditor
        id="override-labels"
        value={content}
        onChange={handleContentChange}
        placeholder={t('_editor-placeholder_')}
        disableTabs
        toolbar={toolbar}
        toolbarPosition="top"
        labels={customLabels}
        withBubbleMenu={false}
      />
    </div>
  );
}
