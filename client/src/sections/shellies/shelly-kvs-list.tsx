/*
  Author: André Kreienbring
  Builds the list of KVS entries of a device shown on a ShellyCard component
*/
import type { KVSEntry } from '@src/types/device';

import { type JSX } from 'react';
import { createUUID } from '@src/utils/general';
import { ColorPreview } from '@src/components/color-utils';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const COLORS = ['#00AB55', '#D22B2B', '#000000'];

interface ShellyKVSListProps {
  deviceIp: string;
  kvs: KVSEntry[];
}

/**
  If not undefined the diplay value of an entry is shown on the ShellyCard.
  This value is configured on the Shellybroker and used to convert tecnical
  values into readable ones.
  The values are presented depending on their type (boolean, text, etc.)
  @param {string} deviceIp The IP adress of the device.
  @param {array} kvs The KVS entries of a device.
  @returns {JSX.Element[]} A list of KVS entries with their key and value.
*/
function ShellyKVSList({ deviceIp, kvs }: ShellyKVSListProps): JSX.Element[] {
  return kvs.map((kvsentry: KVSEntry) => {
    const key = typeof kvsentry.display !== 'undefined' ? kvsentry.display : kvsentry.key;

    // convert the value given on its style attribute
    const convertValue = () => {
      const style = typeof kvsentry.style !== 'undefined' ? kvsentry.style : kvsentry.value;
      switch (style) {
        case 'boolean':
          return Number(kvsentry.value) === 1 ? 'true' : 'false';
        case 'color':
          return (
            <ColorPreview
              key={createUUID()}
              colors={Number(kvsentry.value) === 1 ? COLORS.slice(0, 1) : COLORS.slice(1, 2)}
              sx={{ pt: '5px' }}
            />
          );
        default:
          return kvsentry.value;
      }
    };

    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        style={{ gap: 20 }}
        useFlexGap
        flexWrap="wrap"
        key={createUUID()}
      >
        <Link
          href={`http://${deviceIp}/#/key-value-store/edit?key=${kvsentry.key}`}
          target="_blank"
          color="inherit"
          underline="hover"
          variant="subtitle2"
          noWrap
          sx={{ minWidth: 100 }}
        >
          <Typography key={createUUID()} noWrap variant="caption">
            {key.substring(0, 14)}
          </Typography>
        </Link>
        <Typography key={createUUID()} variant="caption">
          {convertValue()}
        </Typography>
      </Stack>
    );
  });
}

export default ShellyKVSList;
