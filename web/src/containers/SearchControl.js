import React, { useContext, useCallback } from "react";

import SearchBar from "../components/SearchBar";
import SearchContext from "../store";

export default function SearchControl() {
  const [{ packages }] = useContext(SearchContext);

  return (
    <div>
      <h1 className="f2 fw4">
        {packages.length === 0 ? "Compare freshness of packages" : packages}
      </h1>
      <SearchBar />
    </div>
  );
}
