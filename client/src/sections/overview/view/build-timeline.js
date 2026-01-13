/*
  Author: André Kreienbring
  Helpers for building the Timeline Chart in the AppView Component
  Concept: 
  - From the received data a chart series is created for every device.
  - Missing minutes in the 'Minute' chart are filled with null values to create gaps in the line chart.
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
      timeline.format = 'dd.MM';
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
      timeline.format = 'HH:mm';
      timeline.catformat = 'yyyy-MM-dd HH:mm';
  }
  return timeline;
}

/**
  Builds the Timeline chart out of the received websocket consumption
  data.
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
  rows.forEach((row, index) => {
    if (row.consumption > maxConsumption) maxConsumption = row.consumption;

    const category = fUnixTime(row.ts, timeline.catformat);
    if (!chartLabels.includes(category)) chartLabels.push(category);

    // Create a series for every device
    const cdIndex = chartDevices.indexOf(row.device_id);
    if (cdIndex === -1) {
      const dIndex = devices.findIndex((device) => device.id === row.device_id);
      if (dIndex !== -1) {
        chartDevices.push(row.device_id);
        // add the color that corresponds with the device to the color array
        chartColors.push(devices[dIndex].chartColor);

        chartSeries.push({
          name: devices[dIndex].cname,
          type: timeline.data === 'Minute' ? 'line' : 'bar',
          data: [{ x: category, y: row.consumption }],
        });
      } else {
        console.error(`Could not find device with id ${row.device_id}`);
      }
    } else {
      if (timeline.data === 'Minute' && rows[index - 1].device_id === row.device_id) {
        let previousTS = rows[index - 1].ts;
        while (row.ts - previousTS >= 120) {
          // Fill missing minutes with null values, if the difference between the current and previous timestamp is >= 2 minutes
          const missingCategory = fUnixTime(previousTS + 60, timeline.catformat);

          /*
          console.log(
            `Previous cat: ${fUnixTime(previousTS, timeline.catformat)} Current: ${fUnixTime(row.ts, timeline.catformat)} Adding: ${missingCategory}`
          );
          */

          chartSeries[cdIndex].data.push({ x: missingCategory, y: null });
          previousTS = previousTS + 60;
        }
      }
      chartSeries[cdIndex].data.push({ x: category, y: row.consumption });
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
