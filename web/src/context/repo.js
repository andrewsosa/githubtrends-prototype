// @flow

import React from "react";

const RepoContext = React.createContext({});
export default RepoContext;

type State = {
  packages: Set<string>,
};

type Action = {
  type: string,
  payload: {
    package: string,
  },
};

export const initialRepoState = {
  packages: new Set<string>(),
};

export const repoReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "ADD":
      state.packages.add(action.payload.package);
      return state;
    case "REMOVE":
      state.packages.delete(action.payload.package);
      return state;
    default:
      return state;
  }
};
