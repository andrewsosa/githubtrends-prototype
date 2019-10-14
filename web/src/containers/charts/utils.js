// @flow
import axios from "axios";
import moment from "moment";

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

export type Color = [number, number, number];

const COLOR_ARRAY: Color[] = [
  [0, 116, 217],
  [255, 133, 27],
  [46, 204, 64],
  [255, 65, 54],
  [255, 220, 0],
  [127, 219, 255],
  [177, 13, 201],
  [57, 204, 204],
  [0, 31, 63],
  [1, 255, 112],
];

export function color(i: number, a: number): string {
  const rgb = COLOR_ARRAY[i % COLOR_ARRAY.length].join(",");
  return `rgba(${rgb},${a})`;
}

export function chartOptions(round: string = "day") {
  return {
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            round,
          },
        },
      ],
      yAxes: [
        {
          type: "linear",
          ticks: {
            min: 0,
          },
        },
      ],
    },
  };
}

export function renderChartData(datasets: Dataset[]): ChartData {
  return {
    datasets: datasets.map((set, i) =>
      Object.assign(set, {
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 5,
        pointBorderWidth: 1,
        backgroundColor: color(i, 0),
        borderColor: color(i, 1),
        pointBackgroundColor: color(i, 1),
        pointHoverBorderColor: color(i, 1),
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
      })
    ),
  };
}

export function fetchDataset(repo: string, start: Date): Promise<Dataset> {
  start = moment(start).format("YYYY-MM-DD");
  return axios
    .get(`/api/repo-all-activity?repo=${repo}&start=${start}`)
    .then(({ data }) => ({ data, label: repo }))
    .catch(() => ({ data: [], label: repo }));
}
