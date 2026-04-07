import type { TimelineData } from '@src/types/timeline';

/*
  Author: André Kreienbring
  Builds the Timeline Chart in the AppView / Dashboard Component
*/
import { type JSX } from 'react';
import ApexChart from 'react-apexcharts';
import { type ApexOptions } from 'apexcharts';
import { useTranslation } from 'react-i18next';
import { fDateTime } from '@src/utils/format-time';
import { fWh, fKWh } from '@src/utils/format-number';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import { Select, type SelectChangeEvent } from '@mui/material';

interface TimelineConsumptionProps {
  title: string;
  subheader: string;
  chart: TimelineData;
  handleTimelineChange: (event: SelectChangeEvent<unknown>) => void;
  selection: number;
}

/**
  This component presents the Timeline charts of the periods
  minute, hour, day, month and year.
  @param {TimelineConsumptionProps} props
  @param {string} props.title The title of the chart
  @param {string} props.subheader The text shown underneath the title
  @param {TimelineData} props.chart Holds additional data to be used in the chart
  @param {Function} props.handleTimelineChange Called when the type of the chart is changed
  @param {number} props.selection The currently selected type of the chart
*/
export default function TimelineConsumption({
  title,
  subheader,
  chart,
  handleTimelineChange,
  selection,
  ...other
}: TimelineConsumptionProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { labels, colors, series, timeline, maxConsumption } = chart;
  const { t } = useTranslation();

  const chartOptions: ApexOptions = {
    colors,
    legend: {
      show: true,
      position: 'bottom' as const,
      showForSingleSeries: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '28%',
      },
    },
    chart: {
      stacked: timeline!.data !== 'Minute',
      zoom: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter(value) {
          if (timeline!.data === 'Minute') {
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
        // eslint-disable-next-line jsdoc/require-jsdoc
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return fDateTime(Number(value), timeline!.format);
          }
          return value;
        },
        datetimeUTC: false,
      },
      // categories: labels,
    },
    stroke: {
      width: 5,
      curve: 'smooth',
      lineCap: 'round',
    },

    tooltip: {
      shared: false,
      followCursor: true,
      intersect: timeline!.data === 'Minute' ? false : true,
      x: {
        show: true,
        format: timeline!.format || 'undefined',
      },
      y: {
        formatter(value) {
          if (timeline!.data === 'Minute') {
            if ((maxConsumption / 1000) * 60 < 9000) return fWh(value);
            return fKWh(value);
          }
          if (maxConsumption / 1000 < 9000) return `${(value / 1000).toFixed(2)} w/h`;
          return `${(value / 1000 / 1000).toFixed(2)} kw/h`;
        },
      },
    },
  };

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select value={selection.toString()} onChange={handleTimelineChange}>
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
        <ApexChart
          data-testid="chart_timeline_component"
          dir="ltr"
          type={timeline!.data === 'Minute' ? 'line' : 'bar'}
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}
