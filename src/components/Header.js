import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <Link to="/" className="no-underline">
        <h1 className="fw2 black">githubtrends</h1>
      </Link>
    </div>
  );
}
