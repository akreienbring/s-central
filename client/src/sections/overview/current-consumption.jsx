/*
  Author: André Kreienbring
*/

import ApexChart from 'react-apexcharts';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fWh } from 'src/utils/format-number';

/**
 * Component that displays the current consumption circle chart.
 * @param {string} title The title that is displayed on top of the chart
 * @param {string} subheader The subheader, shown beneath the title
 * @param {array} colors contains a color for every device
 * @param {array} series the consumption data used in the chart
 */
export default function CurrentConsumption({ title, subheader, colors, powerPerDevice, ...other }) {
  const theme = useTheme();

  const labels = [];
  const series = [];
  powerPerDevice.forEach((n) => {
    labels.push(n.label);
    series.push(n.value);
  });

  const options = {
    chart: {
      id: 'current-consumption',
    },
    labels,
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      show: true,
      position: 'bottom',
    },
    colors,
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return fWh(value);
          }
          return value;
        },
      },
    },
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <ApexChart
        // TODO: key forces a rerender. Currently not working with react-apexcharts v1.7.0
        key={JSON.stringify(powerPerDevice)}
        type="pie"
        series={series}
        options={options}
        width="100%"
        height={280}
      />
    </Card>
  );
}
