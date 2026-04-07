/*
  Author: André Kreienbring
  Displays system values sent with a 'NotifyFullStatus' websocket message.
*/
import type { Params } from '@src/types/device';

import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Highlighter from '../highlighter';

interface MatterProps {
  elementId: string;
  scrollableElementId: string;
  params: Params;
}

/**
  The values will be displayed in kb
  @param {MatterProps} props
  @param {string} props.elementId The Id of the HTML Element that contains the message.
  @param {string} props.scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {Params} props.params The params property of a 'NotifyFullStatus' websocket message.
  @returns {JSX.Element}
*/
const Matter = ({ elementId, scrollableElementId, params }: MatterProps) => {
  if (typeof params.matter === 'undefined') return null;

  const fabrics = params.matter.num_fabrics;

  return (
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
        text={`"matter":{"num_fabrics":${fabrics}`}
      >
        <Iconify icon="material-symbols:matter" sx={{ color: fabrics > 0 ? 'green' : 'red' }} />
      </Highlighter>
      {fabrics > 0 && (
        <Typography variant="subtitle2" color="green" key={createUUID()}>
          {fabrics}
        </Typography>
      )}
    </Stack>
  );
};

export default Matter;
