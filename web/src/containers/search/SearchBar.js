import React, { useCallback, useContext } from "react";
import styled from "styled-components";

import SearchContext from "./context";

const Input = styled.input`
  &:focus {
    outline: none;
    border-color: var(--secondary);
    transition: all 0.25s ease;
  }
`;

export default function SearchBar() {
  const [{ query, focus }, dispatch] = useContext(SearchContext);

  const changeQuery = value => {
    dispatch({
      type: "QUERY",
      payload: {
        query: value,
      },
    });
  };

  const onInputChange = e => {
    const newValue = (e && e.target && e.target.value) || "";
    changeQuery(newValue);
  };

  const onFocus = useCallback(() => {
    dispatch({
      type: "FOCUS",
    });
  }, [query, dispatch]);

  const onBlur = useCallback(() => {
    setTimeout(() => {
      dispatch({
        type: "UNFOCUS",
      });
    }, 150);
  }, [dispatch]);

  return (
    <div className="relative">
      <Input
        className={`w-100 f4 fw2 ph3 pv2 ba bw1 br3 b--moon-gray ${
          query !== "" && focus ? "br--top" : ""
        }`}
        value={query}
        onChange={onInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
