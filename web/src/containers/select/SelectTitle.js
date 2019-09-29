import React from "react";
import { useSelection } from "./context";

export default function CompareTitle() {
  const [packages] = useSelection();

  return (
    <h1 className="f2 fw2">
      {packages.length === 0
        ? "Compare freshness of packages"
        : [...packages]
            .join("-vs-")
            .split("-")
            .map((item, pos) => {
              return item === "vs" ? (
                <span key={pos}>{" vs "}</span>
              ) : (
                <span key={pos} className="fw4">
                  <a
                    className="black no-underline"
                    href={`https://github.com/${item}`}
                  >
                    {item}
                  </a>
                </span>
              );
            })}
    </h1>
  );
}
