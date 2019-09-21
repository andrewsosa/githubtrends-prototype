// @flow

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

import { aggregateRepoActivity } from "../../libs/contributors";
import SearchContext from "../../store";
import SearchBar from "./SearchBar";
// import Styled from "../../ui/Styled";
import type { ChartData } from "../../libs/types";
import { chartOptions, renderChartData } from "../../libs/charts";

export default function Home() {
  const [{ packages }] = useContext(SearchContext);

  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios
      .get("https://api.github.com/repos/axios/axios/stats/contributors")
      .then(res => res.data)
      .then(data => aggregateRepoActivity(data, { label: "axios" }))
      .then(dataset => renderChartData([dataset]))
      .then(chartData => setChartData(chartData));
  }, []);

  return (
    <div>
      <h1 className="f2 fw4">
        {packages.length === 0 ? "Compare freshness of packages" : packages}
      </h1>
      <SearchBar />
      <Line data={chartData} options={chartOptions()} />
      <pre>{JSON.stringify(chartData, null, 2)}</pre>
    </div>
  );
}
