import React from "react";
import styled from "styled-components";

const Input = styled.input`
  /* border: 2px solid; */
  border-color: #ccc;

  &:focus {
    outline: none;
    border-color: var(--secondary);
    transition: all 0.25s ease;
  }
`;

export default function SearchBar() {
  return (
    <Input
      className="w-100 f4 fw2 ph3 pv2 ba bw1 br3 b--moon-gray"
      defaultValue="Enter an npm package..."
    />
  );
}
