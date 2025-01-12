/*
  Author: André Kreienbring
  Builds the Timeline Chart in the AppView Component
*/
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';

import { fWh, fKWh } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

/*
  This component presents the Timeline charts of the periods
  minute, hour, day, month and year.
*/
export default function TimelineConsumption({
  title,
  subheader,
  chart,
  handleTimelineChange,
  selection,
  ...other
}) {
  // eslint-disable-next-line no-unused-vars
  const { labels, colors, series, timeline, maxConsumption } = chart;
  const { t } = useTranslation();

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '28%',
      },
    },
    chart: {
      stacked: timeline.data !== 'Minute',
    },
    yaxis: {
      labels: {
        formatter(value) {
          if (timeline.data === 'Minute') {
            if ((maxConsumption / 1000) * 60 < 1000) return fWh(value);
            return fKWh(value);
          }
          if (maxConsumption / 1000 < 1000) return `${(value / 1000).toFixed(2)} w/h`;
          return `${(value / 1000 / 1000).toFixed(2)} kw/h`;
        },
      },
      forceNiceScale: true,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: timeline.format,
        datetimeUTC: false,
      },
      // categories: labels,
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        show: true,
        format: timeline.format || 'undefined',
      },
      y: {
        formatter(value) {
          if (timeline.data === 'Minute') {
            if ((maxConsumption / 1000) * 60 < 9000) return fWh(value);
            return fKWh(value);
          }
          if (maxConsumption / 1000 < 9000) return `${(value / 1000).toFixed(2)} w/h`;
          return `${(value / 1000 / 1000).toFixed(2)} kw/h`;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select value={selection} onChange={handleTimelineChange}>
              <MenuItem value="0">{t('_byminute_')}</MenuItem>
              <MenuItem value="1">{t('_byhour_')}</MenuItem>
              <MenuItem value="2">{t('_byday_')}</MenuItem>
              <MenuItem value="3">{t('_bymonth_')}</MenuItem>
              <MenuItem value="4">{t('_byyear_')}</MenuItem>
            </Select>
          </FormControl>
        }
      />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type={series[0].type}
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

TimelineConsumption.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  handleTimelineChange: PropTypes.func,
  selection: PropTypes.number,
};
