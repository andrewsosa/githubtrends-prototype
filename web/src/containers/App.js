import React, { useReducer } from "react";
import "tachyons/css/tachyons.min.css";
import "../styles/global.css";

import Layout from "../components/Layout";
import SearchControl from "./SearchControl";
import MainRouter from "./MainRouter";

import RepoContext, { repoReducer, initialRepoState } from "../context/repo";
import SearchContext, {
  searchReducer,
  initialSearchState,
} from "./search/context";

export default function App() {
  const repoState = useReducer(repoReducer, initialRepoState);
  const searchState = useReducer(searchReducer, initialSearchState);

  return (
    <RepoContext.Provider value={repoState}>
      <Layout>
        <SearchContext.Provider value={searchState}>
          <SearchControl />
        </SearchContext.Provider>
        {/* <MainRouter /> */}
      </Layout>
    </RepoContext.Provider>
  );
}
