import React, { useReducer } from "react";
import "tachyons/css/tachyons.min.css";
import "../styles/global.css";

import Layout from "../components/Layout";
import SearchControl from "./SearchControl";
import MainRouter from "./MainRouter";

import SearchContext from "../store";
import { searchReducer, initialSearchState } from "../store/reducers/search";

export default function App() {
  const searchState = useReducer(searchReducer, initialSearchState);

  return (
    <SearchContext.Provider value={searchState}>
      <Layout>
        <SearchControl />
        <MainRouter />
      </Layout>
    </SearchContext.Provider>
  );
}
