import React, { useContext } from "react";

import RepoContext from "./context";

export default function CompareTitle() {
  const [{ packages }] = useContext(RepoContext);

  console.log("help");

  return (
    <h1 className="f2 fw4">
      {packages.size === 0
        ? "Compare freshness of packages"
        : [...packages].join(" vs ")}
    </h1>
  );
}
