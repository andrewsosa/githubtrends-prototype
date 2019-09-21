// @flow

import type { Dataset, ChartData } from "./types";

type Color = [number, number, number];

const COLOR_ARRAY: Colors[] = [
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

const color = (i: number, a: number): string => {
  const rgb = COLOR_ARRAY[i % COLOR_ARRAY.length].join(",");
  return `rgba(${rgb},${a})`;
};

export function chartOptions(round: string = "week") {
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
        backgroundColor: color(i, 0.2),
        borderColor: color(i, 1),
        pointBackgroundColor: color(i, 1),
        pointHoverBorderColor: color(i, 1),
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
      })
    ),
  };
}
