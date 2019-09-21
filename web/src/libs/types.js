// @flow

// type ChartData =
export type DateValue = { x: Date, y: number };
export type TimeSeries = Array<DateValue>;
export type Aggregation = { [month: string]: number };

export type Dataset = {
  label: string,
  data: TimeSeries,
  [string]: any,
};

export type ChartData = {
  datasets: Dataset[],
  [string]: any,
};
