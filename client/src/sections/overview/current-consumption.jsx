/*
  Author: André Kreienbring
*/
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fWh } from 'src/utils/format-number';

import Chart from 'src/components/chart';

/**
 * Component that displays the current consumption circle chart.
 * @param {string} title The title that is displayed on top of the chart
 * @param {string} subheader The subheader, shown beneath the title
 * @param {array} colors contains a color for every device
 * @param {array} series the consumption data used in the chart
 */
export default function CurrentConsumption({ title, subheader, colors, series, ...other }) {
  const theme = useTheme();

  const labels = [];
  const values = [];
  series.forEach((n) => {
    labels.push(n.label);
    values.push(n.value);
  });

  const options = {
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

      <Chart dir="ltr" type="pie" series={values} options={options} width="100%" height={280} />
    </Card>
  );
}
CurrentConsumption.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  colors: PropTypes.array,
  series: PropTypes.array,
};
