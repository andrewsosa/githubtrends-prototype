// @flow

type State = {
  packages: string[],
};

type Action = {
  type: string,
  payload: {
    package: string,
  },
};

function remove(arr: string[], element: string) {
  arr.splice(arr.findIndex(el => el === element), 1);
  return arr;
}

export const initialSearchState = {
  packages: [],
};

export const searchReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "ADD":
      return {
        packages: [...state.packages, action.payload.package],
      };
    case "REMOVE":
      return {
        packages: remove(state.packages, action.payload.package),
      };
    default:
      return state;
  }
};
