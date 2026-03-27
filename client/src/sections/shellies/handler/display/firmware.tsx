/*
  Author: André Kreienbring
  Renders the current available stable firmware update version of a Shelly device.
*/
import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Highlighter from '../highlighter';

interface FirmwareProps {
  elementId: string;
  scrollableElementId: string;
  version: string;
}

/**
 * Diesplay of the available stable Firmware
  @param {string}  elementId The Id of the HTML Element that contains the message.
  @param {string} scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {string} version The available stable Firmware version of a Shelly device
  @returns {JSX.Element} The available stable Firmware version of a Shelly device with an icon.
*/
const Firmware = ({ elementId, scrollableElementId, version }: FirmwareProps): JSX.Element => (
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
      text={`"stable":{"version":"${version}"}}`}
    >
      <Iconify
        icon="material-symbols:system-update-alt"
        sx={{ color: 'green' }}
        key={createUUID()}
      />
    </Highlighter>
    <Typography variant="caption" key={createUUID()}>
      {version}
    </Typography>
  </Stack>
);

export default Firmware;
