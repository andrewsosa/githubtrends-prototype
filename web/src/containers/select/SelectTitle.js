import React, { useContext } from "react";
import { useSelection } from "./context";

export default function CompareTitle() {
  // const [{ packages }] = useContext(RepoContext);
  const [packages] = useSelection();

  return (
    <h1 className="f2 fw4">
      {packages.length === 0
        ? "Compare freshness of packages"
        : [...packages].join(" vs ")}
    </h1>
  );
}
