/*
  Author: André Kreienbring
  Builds the list of KVS entries of a device shown on a ShellyCard component
*/
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';

import { ColorPreview } from 'src/components/color-utils';

const COLORS = ['#00AB55', '#D22B2B', '#000000'];

/**
  If not undefined the diplay value of an entry is shown on the ShellyCard.
  This value is configured on the Shellybroker and used to convert tecnical
  values into readable ones.
  The values are presented depending on their type (boolean, text, etc.)
  @param {array} kvs The KVS entries of a device.
*/
function ShellyKVSList({ kvs }) {
  return kvs.map((kvsentry, index) => {
    const key = typeof kvsentry.display !== 'undefined' ? kvsentry.display : kvsentry.key;

    // convert the value given on its style attribute
    const convertValue = (value) => {
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
          <Typography key={createUUID()} variant="caption" sx={{ minWidth: 100 }}>
            {key}
          </Typography>
          <Typography key={createUUID()} variant="caption">
            {convertValue()}
          </Typography>
        </Stack>
    );
  });
}

export default ShellyKVSList;

ShellyKVSList.propTypes = {
  kvs: PropTypes.array.isRequired,
};
