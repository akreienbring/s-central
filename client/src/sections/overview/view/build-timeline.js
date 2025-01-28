/*
  Author: André Kreienbring
  Helpers for building the Timeline Chart in the AppView Component
*/
import { fUnixTime } from 'src/utils/format-time';

/**
    Based on the selected chart type (minute, hour, day, month, year)
    formats are defined. These will be used for the labels / categories display
    within the chart.
    @param {number} selectedChart A number that represents the type of the chart
*/
export function getTimelineOptions(selectedChart) {
  const timeline = {};

  switch (selectedChart) {
    case 1:
      timeline.data = 'Hour';
      timeline.format = 'HH:00';
      timeline.catformat = 'yyyy-MM-dd HH:00';
      break;
    case 2:
      timeline.data = 'Day';
      timeline.format = 'd.MM';
      timeline.catformat = 'yyyy-MM-dd';
      break;
    case 3:
      timeline.data = 'Month';
      timeline.format = 'MMM.yyyy';
      timeline.catformat = 'yyyy-MM';
      break;
    case 4:
      timeline.data = 'Year';
      timeline.format = 'yyyy';
      timeline.catformat = 'yyyy';
      break;
    default:
      timeline.data = 'Minute';
      timeline.format = 'H:mm';
      timeline.catformat = 'yyyy-MM-dd HH:mm';
  }
  return timeline;
}

/**
  Builds the Timeline chart out of the received websocket consumption
  data.
  ATTENTION: 'currently stacked charts can NOT be used, because the scaling of the yaxis doesn't work!!!
  @param {array} devices The array with the devices. Needed to identify the chart color.
  @param {array} rows The array with the consumption values
  @param {object} timeline Contains options based on the selected chart (minute, hour, day, month, year)
  @return {object} An object that contains series, labels, colors and the maximun consumption value for the timeline chart.
*/
export function buildTimeline(devices, rows, timeline) {
  const chartLabels = [];
  const chartSeries = [];
  const chartDevices = [];
  const chartColors = [];
  let maxConsumption = 0;
  // console.log(`Got Rows: ${JSON.stringify(rows)}`);
  rows.forEach((entry, index) => {
    if (entry.consumption > maxConsumption) maxConsumption = entry.consumption;

    const category = fUnixTime(entry.ts, timeline.catformat);
    if (!chartLabels.includes(category)) chartLabels.push(category);

    // Create a series for every device
    const nIndex = chartDevices.indexOf(entry.device_id);
    if (nIndex === -1) {
      const dIndex = devices.findIndex((device) => device.id === entry.device_id);
      if (dIndex !== -1) {
        chartDevices.push(entry.device_id);
        // add the color that corresponds with the device to the color array
        chartColors.push(devices[dIndex].chartColor);

        chartSeries.push({
          name: entry.device_cname,
          type: timeline.data === 'Minute' ? 'line' : 'bar',
          data: [{ x: category, y: entry.consumption }],
        });
      } else {
        console.error(`Could not finde device with id ${entry.device_id}`);
      }
    } else {
      chartSeries[nIndex].data.push({ x: category, y: entry.consumption });
    }
  });

  // console.log(`Got Series: ${JSON.stringify(chartSeries)}`);
  // console.log(`Got labels: ${JSON.stringify(chartLabels)}`);

  return {
    labels: chartLabels,
    series: chartSeries,
    colors: chartColors,
    maxConsumption,
  };
}
