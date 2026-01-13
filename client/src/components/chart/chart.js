import { memo } from 'react';
import ApexChart from 'react-apexcharts';

import { alpha, styled } from '@mui/material/styles';
import {
  red,
  pink,
  cyan,
  blue,
  teal,
  lime,
  green,
  amber,
  brown,
  yellow,
  indigo,
  purple,
  orange,
  blueGrey,
  lightBlue,
  deepPurple,
  deepOrange,
  lightGreen,
} from '@mui/material/colors';

import { bgBlur } from 'src/theme/css';

/**
  These colors are used for the consumption charts.
  The device color is dependent on the device index in the device array
  @return {array} An array of colors for easy destinction of multiple devices in a chart
*/
export const useChartColors = () => {
  const muiColors = [
    red,
    deepPurple,
    lightBlue,
    green,
    yellow,
    deepOrange,
    blueGrey,
    pink,
    indigo,
    cyan,
    lightGreen,
    amber,
    brown,
    purple,
    blue,
    teal,
    lime,
    orange,
  ];

  const muiShades = [900, 700, 500, 300];

  const chartColors = [];
  muiColors.forEach((color) => {
    muiShades.forEach((shade) => {
      chartColors.push(color[shade]);
    });
  });

  return chartColors;
};

/**
 * CURRENTLY UNUSED
 */
const Chart = styled(ApexChart)(({ theme }) => ({
  '& .apexcharts-canvas': {
    // Tooltip
    '& .apexcharts-tooltip': {
      ...bgBlur({
        color: theme.palette.background.default,
      }),
      color: theme.palette.text.primary,
      boxShadow: theme.customShadows.dropdown,
      borderRadius: theme.shape.borderRadius * 1.25,
      '&.apexcharts-theme-light': {
        borderColor: 'transparent',
        ...bgBlur({
          color: theme.palette.background.default,
        }),
      },
    },
    '& .apexcharts-xaxistooltip': {
      ...bgBlur({
        color: theme.palette.background.default,
      }),
      borderColor: 'transparent',
      color: theme.palette.text.primary,
      boxShadow: theme.customShadows.dropdown,
      borderRadius: theme.shape.borderRadius * 1.25,
      '&:before': {
        borderBottomColor: alpha(theme.palette.grey[500], 0.24),
      },
      '&:after': {
        borderBottomColor: alpha(theme.palette.background.default, 0.8),
      },
    },
    '& .apexcharts-tooltip-title': {
      textAlign: 'center',
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: alpha(theme.palette.grey[500], 0.08),
      color: theme.palette.text[theme.palette.mode === 'light' ? 'secondary' : 'primary'],
    },

    // LEGEND
    '& .apexcharts-legend': {
      padding: 0,
    },
    '& .apexcharts-legend-series': {
      display: 'inline-flex !important',
      alignItems: 'center',
    },
    '& .apexcharts-legend-marker': {
      marginRight: 8,
    },
    '& .apexcharts-legend-text': {
      lineHeight: '18px',
      textTransform: 'capitalize',
    },
  },
}));

export default memo(Chart);
