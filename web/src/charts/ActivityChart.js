import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

// import SearchContext from "../store";
import { aggregateRepoActivity } from "../libs/contributors";
import { chartOptions, renderChartData } from "../libs/charts";

export default function ActivityChart() {
  // const [{ packages }] = useContext(SearchContext);

  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios
      .get("https://api.github.com/repos/apache/airflow/stats/contributors")
      .then(res => res.data)
      .then(data => aggregateRepoActivity(data, { label: "airflow" }))
      .then(dataset => renderChartData([dataset]))
      .then(chartdata => setChartData(chartdata));
  }, []);

  return (
    <>
      {/* <div>
      <h1 className="f2 fw4">
        {packages.length === 0 ? "Compare freshness of packages" : packages}
      </h1>
      <SearchBar />
      <pre>{JSON.stringify(chartData, null, 2)}</pre>
    </div> */}
      <div className="mt5">
        <Line data={chartData} options={chartOptions()} />
      </div>
    </>
  );
}
