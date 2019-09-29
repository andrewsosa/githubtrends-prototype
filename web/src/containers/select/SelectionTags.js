import React, { useContext } from "react";
import styled from "styled-components";

import RepoContext from "./context";
import { color } from "../../libs/charts";

const Tag = styled.span`
  color: ${props => props.color} !important;
  border-color: ${props => props.color} !important;
  user-select: none;
  box-sizing: border-box;
`;

export default function RepoTags() {
  const [{ packages }, dispatch] = useContext(RepoContext);

  return (
    <div className="mt3">
      {[...packages].map((pkg, i) => (
        <Tag
          key={pkg}
          color={color(i, 1)}
          className="inline-block ba bw1 br3 pa2 mr2"
        >
          {pkg}
        </Tag>
      ))}
    </div>
  );
}
