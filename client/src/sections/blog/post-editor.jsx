/*
  Author: André Kreienbring
  Implementation of https://github.com/tiavina-mika/mui-tiptap-editor
  Used for creating and updating blogposts.
*/
import { TextEditor } from 'mui-tiptap-editor';
import { useTranslation } from 'react-i18next';

/**
 * Component that displays the mui-tiptap-editor
 * @param {function} handleContentChange Every change is reported to keep the post up-to-date
 * @param {string}  content The initial content of the editor
 */
export default function BlogEditor({ handleContentChange, content }) {
  const { t } = useTranslation();

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
    'history',
    'color',
  ];

  /*
    Label translation for the editor.
    Not all of them are currently used!
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
      table: 'Table',
      youtube: 'Youtube',
      undo: t('_editor-undo_'),
      redo: t('_editor-redo_'),
      mention: 'Mention',
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
    table: {
      table: 'Tableau',
      addColumnBefore: 'Ajouter une colonne avant',
      addColumnAfter: 'Ajouter une colonne après',
      deleteColumn: 'Supprimer la colonne',
      addRowBefore: 'Ajouter une ligne avant',
      addRowAfter: 'Ajouter une ligne après',
      deleteRow: 'Supprimer la ligne',
      mergeCells: 'Fusionner les cellules',
      splitCell: 'Diviser la cellule',
      deleteTable: 'Supprimer le tableau',
      insertTable: 'Insérer un tableau',
      toggleHeaderCell: "Basculer la cellule d'en-tête",
      toggleHeaderColumn: "Basculer la colonne d'en-tête",
      toggleHeaderRow: "Basculer la ligne d'en-tête",
      mergeOrSplit: 'Fusionner ou diviser',
      setCellAttribute: "Définir l'attribut de cellule",
    },
    link: {
      link: t('_editor-link_'),
      insert: t('_editor-insertlink_'),
      invalid: t('_editor-invalidlink_'),
    },
    youtube: {
      link: 'Lien',
      insert: 'Insérer la vidéo Youtube',
      title: 'Insérer une vidéo Youtube',
      invalid: 'Lien invalide',
      enter: 'Entrer le lien',
      height: 'Hauteur',
      width: 'Largeur',
    },
  };

  return (
    <div>
      <TextEditor
        value={content}
        onChange={handleContentChange}
        toolbar={toolbar}
        placeholder={t('_editor-placeholder_')}
        disableTabs
        toolbarPosition="top"
        labels={customLabels}
        withBubbleMenu={false}
      />
      <div data-testid="blogpost_content_component" />
    </div>
  );
}
