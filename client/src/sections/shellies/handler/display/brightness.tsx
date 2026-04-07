/*
  Author: André Kreienbring
  Displays the brightness value sent with a 'NotifyFullStatus' websocket message.
*/
import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Highlighter from '../highlighter';

interface BrightnessProps {
  elementId: string;
  scrollableElementId: string;
  brightness: number;
}
/**
  Component that displays the brighness value in percentage
  @param {BrightnessProps} props
  @param {string} props.elementId The Id of the HTML Element that contains the message.
  @param {string} props.scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {object} props.brightness The brightness property of a 'NotifyFullStatus' websocket message.
  @returns {JSX.Element} The brightness value in percentage with an icon.
*/
const Brightness = ({
  elementId,
  scrollableElementId,
  brightness,
}: BrightnessProps): JSX.Element => (
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
      text={`"brightness":${brightness}`}
    >
      <Iconify
        icon="subway:black-white"
        sx={{ color: 'black' }}
        width={18}
        height={18}
        key={createUUID()}
      />
    </Highlighter>
    <Typography variant="caption" key={createUUID()}>
      {brightness}%
    </Typography>
  </Stack>
);

export default Brightness;
