/*
  Author: André Kreienbring
  Displays system values sent with a 'NotifyFullStatus' websocket message.
*/
import type { Sys } from '@src/types/device';

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';

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
  @param {string}  elementId The Id of the HTML Element that contains the message.
  @param {string} scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {object} sys mandatory The sys property of a 'NotifyFullStatus' websocket message.
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
      {Math.round(Number(sys.ram_free) / 1024)} kb free
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
      {Math.round(Number(sys.fs_free) / 1024)} kb free
    </Typography>
  </Stack>
);

export default SystemValues;
