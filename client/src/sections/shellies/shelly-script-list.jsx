/*
  Author: André Kreienbring
  Builds the list of scripts of a device shown on a ShellyCard component.
*/
import { Fragment } from 'react';
import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { createUUID } from 'src/utils/general';

import { ColorPreview } from 'src/components/color-utils';

const COLORS = ['#00AB55', '#D22B2B', '#000000'];

/**
  Before presenting the scripts of a device the array of scripts will be extented
  to 3 scripts. Each indicating with colors if it's running, not running or not used (still available)
  @param {string} deviceIP The IP of the device the scripts are existing on.
  @param {boolean} deviceOnline True if the device in online
  @param {array} scripts The scripts of the device
*/
const ShellyScriptList = ({ deviceIP, deviceOnline, scripts }) => {
  if (
    typeof scripts === 'undefined' ||
    scripts == null ||
    typeof scripts[Symbol.iterator] !== 'function'
  ) {
    /*
      if the device has no scripts at all, generate an array to
      maintain the equal size of the cards
    */
    scripts = [
      { name: 'n/a', colors: COLORS.slice(-1) },
      { name: 'n/a', colors: COLORS.slice(-1) },
      { name: 'n/a', colors: COLORS.slice(-1) },
    ];
  } else {
    // extend to three scripts with colors indicating the status
    scripts = [...scripts]; // new way to copy
    for (let i = 0; i <= 2; i += 1) {
      if (typeof scripts[i] === 'undefined') {
        scripts.push({
          name: 'n/a',
          colors: COLORS.slice(-1),
        });
      } else {
        scripts[i].colors =
          scripts[i].running && deviceOnline ? COLORS.slice(0, 1) : COLORS.slice(1, 2);
      }
    }
  }

  return scripts.map((script) => (
    <Fragment key={createUUID()}>
      <Stack direction="row" style={{ gap: 20 }} useFlexGap flexWrap="wrap" key={createUUID()}>
        <Link
          href={
            script.id !== 0
              ? `http://${deviceIP}/#/script/${script.id}`
              : `http://${deviceIP}/#/scripts`
          }
          target="_blank"
          color="inherit"
          underline="hover"
          variant="subtitle2"
          noWrap
          sx={{ minWidth: 100 }}
        >
          <Typography key={createUUID()} noWrap variant="caption">
            {script.name.substring(0, 14)}
          </Typography>
        </Link>
        <ColorPreview key={createUUID()} colors={script.colors} sx={{ pt: '5px' }} />
      </Stack>
    </Fragment>
  ));
};
export default ShellyScriptList;
ShellyScriptList.propTypes = {
  deviceIP: PropTypes.string.isRequired,
  deviceOnline: PropTypes.bool.isRequired,
  scripts: PropTypes.array.isRequired,
};
