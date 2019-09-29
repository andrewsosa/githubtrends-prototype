import React, { useReducer } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Layout from "../components/Layout";
import Search from "./search";
import SelectTitle from "./select/SelectTitle";
import SelectionTags from "./select/SelectionTags";

import ActivityChart from "./charts/ActivityChart";

import SearchContext, {
  searchReducer,
  initialSearchState,
} from "./search/context";

export default function App() {
  const searchState = useReducer(searchReducer, initialSearchState);

  return (
    <Router>
      {/* <RepoContext.Provider value={repoState}> */}
      <Layout>
        <SelectTitle />
        <SearchContext.Provider value={searchState}>
          <Search />
        </SearchContext.Provider>

        <SelectionTags />
        <ActivityChart />
      </Layout>
    </Router>
  );
}
