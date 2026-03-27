/*
  Author: André Kreienbring
  A custom styled switch component used to start / stop scripts of a device on the ShellyCard component.
*/

import { Switch, styled } from '@mui/material';

/**
 * A custom styled switch component used to start / stop scripts of a device on the ShellyCard component.
 * @param {Switch}
 */
const ScriptSwitch = styled(Switch)(({ theme }) => ({
  width: 45,
  height: 20,
  padding: 5,
  '& .MuiSwitch-thumb': {
    backgroundColor: '#b0bec5',
    width: 17,
    height: 17,
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#d32f2f',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#2e7d32',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
      '& + .MuiSwitch-thumb': {
        opacity: 1,
        backgroundColor: '#2e7d32', // TODO Checked Thumb seems not to work
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
    '&.Mui-disabled': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
}));

export default ScriptSwitch;
