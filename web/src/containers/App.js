import React, { useReducer } from "react";
import "tachyons/css/tachyons.min.css";
import "../styles/global.css";

import Layout from "../components/Layout";
import Search from "./search";
import SelectTitle from "./select/SelectTitle";
import SelectionTags from "./select/SelectionTags";
// import MainRouter from "./MainRouter";

import SearchContext, {
  searchReducer,
  initialSearchState,
} from "./search/context";
import RepoContext, { repoReducer, initialRepoState } from "./select/context";

export default function App() {
  const repoState = useReducer(repoReducer, initialRepoState);
  const searchState = useReducer(searchReducer, initialSearchState);

  return (
    <RepoContext.Provider value={repoState}>
      <Layout>
        <SelectTitle />
        <SearchContext.Provider value={searchState}>
          <Search />
        </SearchContext.Provider>

        <SelectionTags />
        {/* <MainRouter /> */}
      </Layout>
    </RepoContext.Provider>
  );
}
