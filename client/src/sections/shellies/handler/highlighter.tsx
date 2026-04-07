/*
  Author: André Kreienbring
  Used to wrap components that contain text that should be highlighted when the component is hovered 
  with the mouse.
*/
import { type JSX } from 'react';
import { createUUID, highlightText, scrollParentToChild } from '@src/utils/general';

import Box from '@mui/material/Link';

interface HighlighterProps {
  children: React.ReactNode;
  elementId: string;
  text: string;
  scrollableElementId?: string;
}

/**
 * Higlights text when the child compenent is clicked
 * Searches the given text in the HTMLElement identified by the given id and highlights it.
 * @param {HighlighterProps} props
 * @param {React.ReactNode} props.children The child components contained in this component
 * @param {string} props.elementId The id of an html element in which the text is searched and highlighted
 * @param {string} props.text The text to search and highlight
 * @param {string} [props.scrollableElementId] The id of an HTML Element that can bu used to scroll the highlighted text into view
 * @returns {JSX.Element}
 */
const Highlighter = ({
  children,
  elementId,
  text,
  scrollableElementId,
}: HighlighterProps): JSX.Element => {
  /**
   * The function that is used to trigger highlighting on or off.
   * If the id of a scrollable element was provided the higlighted text is scrolle into view.
   * @param {boolean} on If true the text is highlighted else highlighting is turned off
   * @param {string} search The text that is searched and highlighted
   */
  const highlight = (on: boolean, search: string) => {
    const searchEl = document.getElementById(elementId);
    if (searchEl) highlightText(searchEl, search, on);

    if (on && scrollableElementId) {
      const markupEl = document.getElementById('markup');
      const scrollableEl = document.getElementById(scrollableElementId);

      if (markupEl && scrollableEl) scrollParentToChild(scrollableEl, markupEl);
    }
  };

  return (
    <Box
      component="div"
      key={createUUID()}
      onClick={() => highlight(true, text)}
      //onMouseEnter={() => highlight(true, text)}
      // onMouseLeave={() => highlight(false, text)}
      sx={{ pt: 1, cursor: 'pointer' }}
    >
      {children}
    </Box>
  );
};

export default Highlighter;
