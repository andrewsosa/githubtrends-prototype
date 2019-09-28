// @flow

type State = {
  packages: Set<string>,
  query: string,
};

type Action = {
  type: string,
  payload: {
    package: string,
  },
};

export const initialSearchState = {
  packages: new Set<string>(),
};

export const searchReducer = (state: State, action: Action) => {
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
