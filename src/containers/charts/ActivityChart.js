// @flow
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import { useSelection } from "../select/context";
import * as Charts from "./utils";
import type { DataSet } from "./utils";

type State = Map<string, DataSet>;
const initialState: State = new Map<string, DataSet>();

export default function ActivityChart() {
  const [repos] = useSelection();
  const [datasets, setDatasets] = useState<State>(initialState);

  useEffect(() => {
    console.log("Loading chart data...");
    const incoming = new Set<string>(repos);
    const loaded = new Set<string>(datasets.keys());

    // Repo(s) added
    if (incoming.size > loaded.size) {
      const added = [...incoming].filter(el => !loaded.has(el));
      Promise.all(added.map(repo => Charts.fetchDataset(repo, new Date())))
        .then(data =>
          data.reduce((acc, ds) => acc.set(ds.label, ds), new Map(datasets))
        )
        .then(data => setDatasets(data));
    }
    // Repo(s) removed
    else if (incoming.size < loaded.size) {
      const removed = [...loaded].filter(el => !incoming.has(el));
      const upcoming = new Map(datasets);
      removed.forEach(el => upcoming.delete(el));
      setDatasets(upcoming);
    }
    // Why did this even trigger
    else {
      console.log("useEffect triggered without repos changing");
    }

    // Promise.all(
    //   repos.map(repo =>
    //     axios
    //       .get(`/api/repo-all-activity?repo=${repo}&start=2019-09-01`)
    //       .then(({ data }) => ({ data, label: repo }))
    //       .catch(() => ({ data: [], label: repo }))
    //   )
    // )
    //   .then(datasets => Charts.renderChartData(datasets))
    //   .then(data => setChartData(data));
  }, [JSON.stringify(repos)]);

  return (
    <>
      <div className="mt5">
        <Line
          data={Charts.renderChartData(Array.from(datasets.values()))}
          options={Charts.chartOptions()}
        />
      </div>
    </>
  );
}
