/*
  Author: André Kreienbring
*/
import type { Device } from '@src/types/device';
import type { CommandDeviceType } from '@src/types/rule';

import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { createUUID } from '@src/utils/general';

import { Stack, Tooltip, MenuItem, TextField, IconButton } from '@mui/material';

interface CommandDeviceProps {
  commands: string[];
  devices: Device[];
  commandsDevices: CommandDeviceType[];
  handleCommandChange: (value: string, cdIndex: number) => void;
  handleDeviceChange: (value: string, cdIndex: number) => void;
  handleAddCommand: () => void;
  handleDeleteCommand: (cdIndex: number) => void;
}
/**
 * A component used to select command / device combinations
 * @param {CommandDeviceProps} props
 * @param {string[]} props.commands - A list of commands as strings
 * @param {any[]} props.devices - A list of device objects
 * @param {CommandDeviceType[]} props.commandsDevices - A list of already existing command / device combinations
 * @param {Function} props.handleCommandChange - Called when a command was selected
 * @param {Function} props.handleDeviceChange - Called when a device was selected
 * @param {Function} props.handleAddCommand - Called when a command was added to a combination
 * @param {Function} props.handleDeleteCommand - Called when a command was deletet from a combination
 * @returns {JSX.Element}
 */
export default function CommandDevice({
  commands,
  devices,
  commandsDevices,
  handleCommandChange,
  handleDeviceChange,
  handleAddCommand,
  handleDeleteCommand,
}: CommandDeviceProps): JSX.Element {
  /**
   * Checks if a device is already existing in the list of commands and devices.
   * If yes it can't be selected again.
   * @param {string} id - the id of a devices
   * @returns {boolean} true if the devices was already selected, false otherwise.
   */
  const isSelected = (id: string): boolean => {
    const index = commandsDevices.findIndex((commandDevice) => commandDevice.device.id === id);
    return index !== -1;
  };

  return (
    <Stack>
      {commandsDevices.map((entry, cdIndex) => (
        <Stack key={`STCD_${cdIndex}`} spacing={2} direction="row" sx={{ alignItems: 'center' }}>
          <TextField
            size="small"
            variant="filled"
            select
            value={entry.command}
            name="command"
            onChange={(event) => handleCommandChange(event.target.value, cdIndex)}
            sx={{ width: 130 }}
          >
            {commands.map((command) => (
              <MenuItem key={createUUID()} value={command}>
                {command}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            variant="filled"
            select
            value={entry.device.id}
            name="device"
            onChange={(event) => handleDeviceChange(event.target.value, cdIndex)}
            sx={{ width: 130 }}
          >
            {devices.map((device) => (
              <MenuItem
                key={createUUID()}
                disabled={isSelected(device.id)}
                value={entry.device.id === device.id ? entry.device.id : device.id}
              >
                {entry.device.id === device.id ? entry.device.cname : device.cname}
              </MenuItem>
            ))}
          </TextField>

          <Tooltip title="Add Command">
            <span>
              <IconButton
                disabled={devices.length === commandsDevices.length}
                onClick={() => handleAddCommand()}
                sx={{ p: 0, m: 0, height: 'fit-content' }}
              >
                <Iconify icon="material-symbols:add-rounded" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete Command">
            <span>
              <IconButton
                disabled={commandsDevices.length === 1}
                onClick={() => handleDeleteCommand(cdIndex)}
                sx={{ p: 0, ml: 0, mr: 0, height: 'fit-content' }}
              >
                <Iconify icon="material-symbols:clear-rounded" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ))}
    </Stack>
  );
}
