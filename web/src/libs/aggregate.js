// @flow
import type { DateValue, TimeSeries, Aggregation } from "./types";

export type AggregateRounder = Date => Date;

/**
 * Round a date to the start of it's month.
 */
export function roundToMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Aggregate a timeseries by rounding the date values.
 */
export function aggregateTimeSeries(
  data: TimeSeries,
  rounding?: Date => Date = roundToMonth
): TimeSeries {
  const reducer = (
    accumulator: Aggregation,
    { x: dt, y: value }: DateValue
  ): Aggregation => {
    const key: string = String(rounding(dt).getTime());
    const monthValue: number = accumulator[key] || 0;

    return {
      ...accumulator,
      [key]: monthValue + value,
    };
  };

  const aggregatedMonths = data.reduce(reducer, {});

  return Object.keys(aggregatedMonths).map((key: any) => {
    return {
      x: new Date(Number(key)),
      y: aggregatedMonths[key],
    };
  });
}

/**
 * Take an array of TimeSeries (array of arrays of objects)
 */
export function mergeTimeSeries(series: TimeSeries[]): TimeSeries {
  const flat: TimeSeries = series.flat();

  const aggregated = flat.reduce<Aggregation>((acc, { x, y }: DateValue) => {
    const key: string = String(x.getTime());
    const cur: number = acc[key] || 0;
    return {
      ...acc,
      [key]: cur + y,
    };
  }, {});

  return Object.entries(aggregated).map(([x, y]) => ({
    x: new Date(Number(x)),
    y,
  }));
}
