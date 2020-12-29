import React from "react";
import { Line } from "react-chartjs-2";

import styles from "./LineChart.module.css";

export const COLOR_ARRAY = [
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

export const color = (i, a) => {
  const rgb = COLOR_ARRAY[i % COLOR_ARRAY.length].join(",");
  return `rgba(${rgb},${a})`;
};

const renderChartData = ({ datasets }) => {
  return {
    datasets: datasets.map((set, i) =>
      Object.assign(set, {
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 1,
        backgroundColor: color(i, 0),
        borderColor: color(i, 1),
        // pointBackgroundColor: color(i, 1),
        pointBackgroundColor: "transparent",
        pointHoverBorderColor: color(i, 1),
        // pointBorderColor: "#fff",
        pointBorderColor: "transparent",
        // pointHoverBackgroundColor: "#fff",
        pointHoverBackgroundColor: color(i, 1),
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
    maintainAspectRatio: false,
    legend: {
      onClick: (e) => e.stopPropagation(),
      labels: {
        // padding: 25,
        // fontSize: 14,
        usePointStyle: true,
        generateLabels: (chart) => {
          const { data } = chart;
          if (!data.datasets.length) {
            return [];
          }
          return data.datasets.map((dataset) => ({
            text: dataset.label,
            fillStyle: dataset.borderColor,
            strokeStyle: "transparent",
          }));
        },
      },
    },
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
