import React, { useContext } from "react";

import RepoContext from "../context/repo";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";

export function SearchTitle() {
  const [{ packages }] = useContext(RepoContext);

  return (
    <h1 className="f2 fw4">
      {packages.size === 0
        ? "Compare freshness of packages"
        : [...packages].join(" vs ")}
    </h1>
  );
}

export default function SearchControl() {
  return (
    <div className="relative">
      <SearchTitle />
      <SearchBar />
      <SearchResults />
      {/* <InstantSearch indexName="github_repos" searchClient={searchClient}>
        <SearchBox />
        <Hits />
      </InstantSearch> */}
    </div>
  );
}
