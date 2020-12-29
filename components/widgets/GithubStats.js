import React from "react";
import moment from "moment";
import useGithubStats from "../../hooks/useGithubStats";
import { color } from "./LineChart";
import styles from "./GithubStats.module.css";

export default function GithubStats({ names }) {
  const [stats, getStats] = useGithubStats();

  // TODO: find a better way to memoize this effect
  React.useEffect(() => {
    names.map((name) => getStats(name));
  }, [JSON.stringify(names)]);

  return (
    <div>
      <h2 className="content-title">Github Stats</h2>
      <div className={styles.scroll}>
        <table className="table">
          <thead className={styles.head}>
            <th></th>
            <th></th>
            <th>stars 🌟</th>
            <th>issues ⚠️</th>
            <th>updated 🛠</th>
            <th>created 🐣</th>
          </thead>
          <tbody>
            {Object.entries(stats).map(([repoName, repoStats], i) => (
              <tr key={repoName}>
                <td className={styles.wrapper}>
                  <div
                    className={styles.square}
                    style={{ backgroundColor: color(i, 1) }}
                  />
                </td>
                <td>
                  <a
                    className="font-weight-medium"
                    href={`https://github.com/${repoName}`}
                  >
                    {repoName}
                  </a>
                </td>
                <td>{repoStats.stargazersCount.toLocaleString()}</td>
                <td>{repoStats.openIssues.toLocaleString()}</td>
                <td>{moment(repoStats.pushedAt).format("MMM Do, YYYY")}</td>
                <td>{moment(repoStats.createdAt).format("MMM Do, YYYY")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
