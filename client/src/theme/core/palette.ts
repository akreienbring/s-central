import type { ThemeColorScheme } from '../types';

import { varAlpha, createPaletteChannel } from '@src/theme/utils';

import type { PaletteColor, ColorSystemOptions } from '@mui/material/styles';

import { themeConfig } from '../theme-config';

// ----------------------------------------------------------------------

/**
 * TypeScript (type definition and extension)
 * @to {@link file://./../extend-theme-types.d.ts}
 */

// Palette color without additional channels
export type PaletteColorNoChannels = Omit<PaletteColor, 'lighterChannel' | 'darkerChannel'>;

// Extended common colors
export type CommonColorsExtend = {
  whiteChannel: string;
  blackChannel: string;
};

// Extended text colors
export type TypeTextExtend = {
  disabledChannel: string;
};

// Extended background colors
export type TypeBackgroundExtend = {
  neutral: string;
  neutralChannel: string;
};

// Extended palette colors
export type PaletteColorExtend = {
  lighter: string;
  darker: string;
  lighterChannel: string;
  darkerChannel: string;
};

// Extended grey channels
export type GreyExtend = {
  '50Channel': string;
  '100Channel': string;
  '200Channel': string;
  '300Channel': string;
  '400Channel': string;
  '500Channel': string;
  '600Channel': string;
  '700Channel': string;
  '800Channel': string;
  '900Channel': string;
};

// ----------------------------------------------------------------------

// Primary color
export const primary = createPaletteChannel(themeConfig.palette.primary);

// Secondary color
export const secondary = createPaletteChannel(themeConfig.palette.secondary);

// Info color
export const info = createPaletteChannel(themeConfig.palette.info);

// Success color
export const success = createPaletteChannel(themeConfig.palette.success);

// Warning color
export const warning = createPaletteChannel(themeConfig.palette.warning);

// Error color
export const error = createPaletteChannel(themeConfig.palette.error);

// Common color
export const common = createPaletteChannel(themeConfig.palette.common);

// Grey color
export const grey = createPaletteChannel(themeConfig.palette.grey);

// Text color
const text = {
  light: createPaletteChannel({
    primary: grey[800],
    secondary: grey[600],
    disabled: grey[500],
  }),
};

// Background color
const background = {
  light: createPaletteChannel({
    paper: '#FFFFFF',
    default: grey[100],
    neutral: grey[200],
  }),
};

// Base action color
const baseAction = {
  hover: varAlpha(grey['500Channel'], 0.08),
  selected: varAlpha(grey['500Channel'], 0.16),
  focus: varAlpha(grey['500Channel'], 0.24),
  disabled: varAlpha(grey['500Channel'], 0.8),
  disabledBackground: varAlpha(grey['500Channel'], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

// Action color
const action = {
  light: { ...baseAction, active: grey[600] },
};

// ----------------------------------------------------------------------

// Base palette
const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  common,
  grey,
  divider: varAlpha(grey['500Channel'], 0.2),
};

export const palette: Partial<Record<ThemeColorScheme, ColorSystemOptions['palette']>> = {
  light: {
    ...basePalette,
    text: text.light,
    background: background.light,
    action: action.light,
  },
};
