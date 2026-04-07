/*
  Author: André Kreienbring
  Displays system values sent with a 'NotifyFullStatus' websocket message.
*/
import type { Sys } from '@src/types/device';

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';
import { fByte } from '@src/utils/format-number';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Highlighter from '../highlighter';

interface SystemValuesProps {
  elementId: string;
  scrollableElementId: string;
  sys: Sys;
}

/**
  The values will be displayed in kb
  @param {} props
  @param {string}  props.elementId The Id of the HTML Element that contains the message.
  @param {string} props.scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {Sys} props.sys mandatory The sys property of a 'NotifyFullStatus' websocket message.
*/
const SystemValues = ({ elementId, scrollableElementId, sys }: SystemValuesProps): JSX.Element => (
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
      text={`ram_free":${sys.ram_free}`}
    >
      <Iconify icon="material-symbols-light:sd" sx={{ color: 'black' }} key={createUUID()} />
    </Highlighter>
    <Typography variant="caption" key={createUUID()}>
      {fByte(Number(sys.ram_free))} free
    </Typography>
    <Highlighter
      key={createUUID()}
      elementId={elementId}
      scrollableElementId={scrollableElementId}
      text={`fs_free":${sys.fs_free}`}
    >
      <Iconify icon="material-symbols:storage-rounded" sx={{ color: 'black' }} key={createUUID()} />
    </Highlighter>
    <Typography variant="caption" key={createUUID()}>
      {fByte(Number(sys.fs_free))} free
    </Typography>
  </Stack>
);

export default SystemValues;
