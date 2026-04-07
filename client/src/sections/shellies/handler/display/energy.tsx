/*
  Author: André Kreienbring
  Render the current consumption of a Shelly device.
*/
import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { fWh } from '@src/utils/format-number';
import { createUUID } from '@src/utils/general';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Highlighter from '../highlighter';

interface EnergyProps {
  elementId: string;
  scrollableElementId: string;
  consumption: number;
}
/**
  The device consumption will be displayed as icon with the unit 'w/h'.
  @param {EnergyProps} props
  @param {string} props.elementId The Id of the HTML Element that contains the message.
  @param {string} props.scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {number} props.consumption The current energy consumption of a device in mw/m.
*/
const Energy = ({ elementId, scrollableElementId, consumption }: EnergyProps): JSX.Element => (
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
      text='"aenergy":'
    >
      <Iconify
        icon="material-symbols-light:bolt"
        sx={{ color: Number(consumption > 0) ? 'blue' : 'black' }}
        key={createUUID()}
      />
    </Highlighter>
    <Typography variant="caption" key={createUUID()}>
      {fWh(consumption)}
    </Typography>
  </Stack>
);
export default Energy;
