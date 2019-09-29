// @flow

import { useLocation, useHistory } from "react-router";

type State = string[];

type Action = {
  type: string,
  payload: string,
};

function assemble(packages: State): string {
  return `/${packages.join("-vs-")}`;
}

function disassemble(pathname: string): State {
  return pathname.slice(1).split("-vs-");
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return state.concat([action.payload]);
    case "REMOVE":
      return state.filter(pkg => pkg !== action.payload);
    default:
      return state;
  }
}

export function useSelection() {
  const history = useHistory();
  const { pathname } = useLocation();
  const state: State = disassemble(pathname);

  const setState = (action: Action) =>
    history.push(assemble(reducer(state, action)));

  return [state, setState];
}
