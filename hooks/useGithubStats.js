import React from "react";
import axios from "axios";

export default function useGithubStats() {
  const [stats, setState] = React.useState({});

  const addRepo = (name) => {
    axios({
      method: "get",
      url: `https://api.github.com/repos/${name}`,
    })
      .then((resp) => resp.data)
      // eslint-disable-next-line camelcase
      .then(({ stargazers_count, open_issues, created_at, pushed_at }) => {
        setState((s) => ({
          ...s,
          [name]: {
            stargazersCount: stargazers_count,
            openIssues: open_issues,
            createdAt: created_at,
            pushedAt: pushed_at,
          },
        }));
      });
  };

  return [stats, addRepo];
}
