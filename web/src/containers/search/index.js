import React from "react";

import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

export default function Search() {
  return (
    <div className="relative">
      <SearchBar />
      <SearchResults />
    </div>
  );
}
