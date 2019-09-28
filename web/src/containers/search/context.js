// @flow

import React from "react";

const SearchContext = React.createContext({});
export default SearchContext;

type State = {
  query: string,
  focus: boolean,
};

type Action = {
  type: string,
  payload: {
    query?: string,
  },
};

export const initialSearchState = {
  query: "",
};

export const searchReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "QUERY":
      return {
        ...state,
        query: action.payload.query,
      };
    case "FOCUS":
      return {
        ...state,
        focus: true,
      };
    case "UNFOCUS":
      return {
        ...state,
        focus: false,
      };
    case "SELECT":
      return {
        ...state,
        query: "",
        focus: false,
      };
    default:
      return state;
  }
};
