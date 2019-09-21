import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

import { renderDataSet } from "../../../libs/contributors";
import { applyAggregateToChartData } from "../../../libs/aggregate";
import SearchContext from "../../../store";
import SearchBar from "./SearchBar";
// import Styled from "../../ui/Styled";
import type { ChartData } from "../../../libs/types";

export default function Home() {
  const [{ packages }] = useContext(SearchContext);

  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios
      .get("https://api.github.com/repos/axios/axios/stats/contributors")
      .then(res => res.data)
      .then(raw => raw.slice().sort((a, b) => b.total - a.total))
      .then(sorted => sorted.slice(0, 10))
      .then(data => renderDataSet(data))
      .then((cd: ChartData) => applyAggregateToChartData(cd))
      .then((cd: ChartData) => setChartData(cd));
  }, []);

  return (
    <div>
      <h1 className="f2 fw4">
        {packages.length === 0 ? "Compare freshness of packages" : packages}
      </h1>
      <SearchBar />
      <Line
        data={chartData}
        options={{
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  // parser:
                  round: "week",
                },
              },
            ],
            yAxes: [
              {
                type: "linear",
                // ticks: {
                //   autoSkip: true,
                //   min: 0,
                //   callback: (value, index, values) => {
                //     if (
                //       value === 10 ||
                //       value === 100 ||
                //       value === 1000 ||
                //       value === 10000 ||
                //       value === 100000 ||
                //       value === 1000000 ||
                //       value === 10000000
                //     ) {
                //       return value + " LOC";
                //     }
                //   },
                // },
              },
            ],
          },
        }}
      />
      <pre>{JSON.stringify(chartData, null, 2)}</pre>
    </div>
  );
}
