import React, { useCallback, useContext, useState, useEffect } from "react";
// import styled from "styled-components";
import algoliasearch from "algoliasearch/lite";

import { useSelection } from "../select/context";
import SearchContext from "./context";

const appid = "7OG9E7U0M9";
const apikey = "cc0e518dff8625407892d9e47e689b92";
const searchClient = algoliasearch(appid, apikey);
const index = searchClient.initIndex("github_repos");

export default function SearchResults() {
  const [, setState] = useSelection();
  const [{ query, focus }, searchDispatch] = useContext(SearchContext);
  const [options, setOptions] = useState([]);

  const onClick = useCallback(
    repoName => {
      searchDispatch({
        type: "SELECT",
      });
      setState({
        type: "ADD",
        payload: repoName,
      });
    },
    [searchDispatch, setState]
  );

  useEffect(() => {
    if (query === "") setOptions([]);
    else
      index.search(
        {
          query,
        },
        (err, { hits }) => {
          if (err) throw err;
          setOptions(hits.slice(0, 5));
        }
      );
  }, [query]);

  return (
    <>
      {focus && options && options.length !== 0 && (
        <div className="absolute w-100 bg-white bl br bb bw1 br3 br--bottom b--moon-gray">
          {options.map(opt => (
            <div
              key={opt.repo_name}
              onClick={() => onClick(opt.repo_name)}
              className="w-100 ph3 pv2"
            >
              <span className="f5">{opt.repo_name}</span>
              <br />
              <span className="f6">{opt.repo_url}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
