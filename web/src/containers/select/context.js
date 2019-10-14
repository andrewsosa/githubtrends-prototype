// @flow

import { useLocation, useHistory } from "react-router";

type State = string[];

type Action = {
  type: string,
  payload: string,
};

export const ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
};

function assemble(packages: State): string {
  return `/${packages.join("-vs-")}`;
}

function disassemble(pathname: string): State {
  return pathname
    .slice(1)
    .split("-vs-")
    .filter(segment => segment !== "");
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ACTIONS.ADD:
      return state.concat([action.payload]);
    case ACTIONS.REMOVE:
      return state.filter(pkg => pkg !== action.payload);
    default:
      return state;
  }
}

export function withRepo(packages: State, pkg: string): string {
  return assemble(reducer(packages, { type: ACTIONS.ADD, payload: pkg }));
}

export function withoutRepo(packages: State, pkg: string): string {
  return assemble(reducer(packages, { type: ACTIONS.REMOVE, payload: pkg }));
}

export function useSelection() {
  const history = useHistory();
  const { pathname } = useLocation();
  const state: State = disassemble(pathname);

  const setState = (action: Action) =>
    history.push(assemble(reducer(state, action)));

  return [state, setState];
}
