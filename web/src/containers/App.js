import React, { useReducer } from "react";
import "tachyons/css/tachyons.min.css";
import "../styles/global.css";

import SearchContext from "../store";
import { searchReducer, initialSearchState } from "../store/reducers/search";

import MainRouter from "./MainRouter";

export default function App() {
  const searchState = useReducer(searchReducer, initialSearchState);

  return (
    <SearchContext.Provider value={searchState}>
      <MainRouter />
    </SearchContext.Provider>
  );
}
