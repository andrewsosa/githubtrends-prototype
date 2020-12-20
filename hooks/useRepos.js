/* eslint-disable lines-between-class-members */
import React from "react";
import CommitService from "../services/CommitService";

const Commits = new CommitService();

const initialState = {
  search: "",
  repos: {},
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
      Commits.pull(s.search).then(onCommitsReceived);
      return {
        ...s,
        search: "",
        repos: { ...s.repos, [s.search]: { status: "loading", data: null } },
      };
    });
  };

  const updateSearch = (value) => {
    setState((s) => ({ ...s, search: value }));
  };

  return {
    state,
    actions: { commitSearch, rmRepo, updateSearch },
  };
}
