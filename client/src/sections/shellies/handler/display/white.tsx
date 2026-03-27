/*
  Author: André Kreienbring
  Displays the white value sent with a 'NotifyFullStatus' websocket message.
*/
import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Highlighter from '../highlighter';

interface WhiteProps {
  elementId: string;
  scrollableElementId: string;
  white: number;
}
/**
  The values will be displayed in kb
 @param {string}  elementId The Id of the HTML Element that contains the message.
  @param {string} scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {object} white The white property of a 'NotifyFullStatus' websocket message.
  @returns {JSX.Element} The white value of a 'NotifyFullStatus' websocket message with an icon.
*/
const White = ({ elementId, scrollableElementId, white }: WhiteProps): JSX.Element => (
  <Stack
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    spacing={0.5}
    key={createUUID()}
  >
    <Highlighter
      key={createUUID()}
      elementId={elementId}
      scrollableElementId={scrollableElementId}
      text={`"white":${white}`}
    >
      <Iconify icon="stash:circle-dot" sx={{ color: 'black' }} key={createUUID()} />
    </Highlighter>
    <Typography variant="caption" key={createUUID()}>
      {white}
    </Typography>
  </Stack>
);

export default White;
