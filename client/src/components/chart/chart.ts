/*
  Author: André Kreienbring
  Contains a hook, that is used to build an array of (device) colors used in charts.
  The color is determined by the index of the device in the devices array. 
*/
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

/**
  These colors are used for the consumption charts. The hook build the array 
  from a combination of given colors and different shades.
  The device color is dependent on the device index in the device array
  @return {string[]} An array of colors for easy destinction of multiple devices in a chart
*/
export const useChartColors = (): string[] => {
  const muiColors: object[] = [
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

  const muiShades: string[] = ['900', '700', '500', '300'];

  const chartColors: string[] = [];
  // iterating like this prefers dark colors for the first devices in the device array
  for (let i = 0; i < 4; i++) {
    // start with the darkest shade...
    muiColors.forEach((color: object) => {
      // ...of all colors
      for (const [key, value] of Object.entries(color)) {
        // get the color key and value
        if (muiShades[i] === key) {
          // push the darkest shade of the current color
          chartColors.push(value);
        }
      }
    });
  }

  return chartColors;
};
