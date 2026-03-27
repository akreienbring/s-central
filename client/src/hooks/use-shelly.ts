/*
  Author: André Kreienbring
  A hook for using the SContext provider.
  Moving the hook into a separate '.ts' file, other than the context implementation,
  was necessary because vite hmr (hot module reloading) complaint over an export that 
  is not CamelCase.
*/
import type { SContext } from '@src/types/context';

import { useContext, createContext } from 'react';

export const ShellyContext = createContext({} as SContext);

export const useShelly = () => useContext(ShellyContext);
