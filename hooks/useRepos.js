/* eslint-disable lines-between-class-members */
import React from "react";
import CommitService from "../services/CommitService";

const Commits = new CommitService();

export class Interval {
  static ONE_YEARS = "ONE_YEARS";
  static TWO_YEARS = "TWO_YEARS";
  static FIVE_YEARS = "FIVE_YEARS";
  static TEN_YEARS = "TEN_YEARS";
}

const initialState = {
  search: "",
  repos: {},
  interval: Interval.ONE_YEARS,
};

export default function useRepos() {
  const [state, setState] = React.useState(initialState);

  const rmRepo = (name) => {
    setState((s) => {
      const newRepos = {
        ...s.repos,
      };

      delete newRepos[name];

      return {
        ...s,
        repos: newRepos,
      };
    });
  };

  const onCommitsReceived = ({ repo, commits, status }) => {
    if (status !== 200) {
      rmRepo(repo);
      return;
    }
    setState((s) => {
      return {
        ...s,
        repos: { ...s.repos, [repo]: { status: "complete", data: commits } },
      };
    });
  };

  const commitSearch = () => {
    setState((s) => {
      Commits.pull(s.search, s.interval).then(onCommitsReceived);
      return {
        ...s,
        search: "",
        repos: { ...s.repos, [s.search]: { status: "loading", data: null } },
      };
    });
  };

  const setInterval = (interval) => {
    setState((s) => ({
      ...s,
      interval,
    }));
  };

  const updateSearch = (value) => {
    setState((s) => ({ ...s, search: value }));
  };

  // Whenever interval changes, also has effect for initially
  // loading data
  React.useEffect(() => {
    console.log("interval change effect");
    const { repos, interval } = state;
    Object.keys(repos).forEach((r) =>
      Commits.pull(r, interval).then(onCommitsReceived)
    );
  }, [state.interval]);

  return {
    state,
    actions: { commitSearch, rmRepo, setInterval, updateSearch },
  };
}
