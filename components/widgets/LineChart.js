import React from "react";
import { Line } from "react-chartjs-2";

import styles from "./LineChart.module.css";

const COLOR_ARRAY = [
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

const color = (i, a) => {
  const rgb = COLOR_ARRAY[i % COLOR_ARRAY.length].join(",");
  return `rgba(${rgb},${a})`;
};

const renderChartData = ({ datasets }) => {
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
};

export default function LineChart({ repos, labelField, dataField }) {
  const mapData = (data) => {
    if (!data) return [];
    return data.map((row) => ({
      x: Date.parse(row[labelField]),
      y: row[dataField],
    }));
  };

  const chartData = {
    datasets: Object.entries(repos).map(([repo, { data }]) => ({
      label: repo,
      data: mapData(data),
    })),
  };

  const chartOpts = {
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "month",
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

  return (
    <div className={styles.chart}>
      <Line data={renderChartData(chartData)} options={chartOpts} />
    </div>
  );
}
