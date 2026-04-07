/*
  Author: André Kreienbring
  Builds the list of scripts of a device shown on a ShellyCard component.
*/
import type { DeviceScript } from '@src/types/device';

import { type JSX } from 'react';
import { createUUID } from '@src/utils/general';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ScriptSwitch from './script-switch';

interface ShellyScriptListProps {
  deviceIP: string;
  deviceOnline: boolean;
  scripts: DeviceScript[];
  handleScriptToggle: (index: number) => void;
}
/**
  Before presenting the scripts of a device the array of scripts will be extented
  to 3 scripts. A list of switches can be used to start / stop existing scripts
  @param {ShellyScriptListProps} props
  @param {string} props.deviceIP The IP of the device the scripts are existing on.
  @param {boolean} props.deviceOnline True if the device in online
  @param {DeviceScript[]} props.scripts The scripts of the device
  @param {Function} props.handleScriptToggle Gets called when a script is started / stopped
  @returns {JSX.Element} A list of scripts with their name and a switch to start / stop them.
*/
const ShellyScriptList = ({
  deviceIP,
  deviceOnline,
  scripts,
  handleScriptToggle,
}: ShellyScriptListProps): JSX.Element => {
  // extend to three scripts
  const extendedScripts = Array(3);
  for (let i = 0; i <= 2; i += 1) {
    if (typeof scripts[i] === 'undefined') {
      extendedScripts[i] = {
        name: 'n/a',
        id: null,
        running: false,
      };
    } else {
      extendedScripts[i] = scripts[i];
      extendedScripts[i].running = scripts[i].running && deviceOnline;
      extendedScripts[i].index = i;
    }
  }

  return (
    <Stack key={createUUID()}>
      {extendedScripts.map((script) => (
        <Stack direction="row" style={{ gap: 20 }} useFlexGap flexWrap="wrap" key={createUUID()}>
          <Link
            href={
              script.id !== null
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
          <ScriptSwitch
            size="small"
            defaultChecked={script.running}
            disabled={script.id === null}
            color={script.id !== null ? (script.running ? 'success' : 'warning') : 'default'}
            onChange={() => handleScriptToggle(script.index)}
          />
        </Stack>
      ))}
    </Stack>
  );
};

export default ShellyScriptList;
