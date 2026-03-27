/*
  Author: André Kreienbring
  Exports types for the Timeline Chart in the AppView Component
*/

export type TimelineOptions = {
  data: string;
  format: string;
  catformat: string;
};

export type Series = {
  name: string;
  data: { x: string; y: number | null }[];
};

export type TimelineData = {
  series: Series[];
  labels: string[];
  colors: string[];
  timeline?: TimelineOptions;
  maxConsumption: number;
};

export type ConsumptionData = {
  device_id: string;
  device_cname: string;
  ts: number;
  minute?: number;
  hour?: number;
  day?: number;
  month?: number;
  year?: number;
  consumption: number;
};
