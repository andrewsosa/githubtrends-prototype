// @flow
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

// import SearchContext from "../store";
import { useSelection } from "../select/context";
import { aggregateRepoActivity } from "../../libs/contributors";
import { chartOptions, renderChartData } from "../../libs/charts";

const loadContributors = (repo: string) =>
  axios
    .get(`https://api.github.com/repos/${repo}/stats/contributors`)
    .then(res => res.data)
    .then(data => aggregateRepoActivity(data, { label: repo }));

export default function ActivityChart() {
  const [repos] = useSelection();
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    console.log("effect!!");
    Promise.all(repos.map(repo => loadContributors(repo)))
      .then(datasets => renderChartData(datasets))
      .then(data => setChartData(data));
  }, [repos, JSON.stringify(repos)]);

  console.log("activity chart");

  return (
    <>
      <div className="mt5">
        <Line data={chartData} options={chartOptions()} />
      </div>
    </>
  );
}
