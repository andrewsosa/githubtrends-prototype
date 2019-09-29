import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useSelection, withoutRepo } from "./context";
import { color } from "../../libs/charts";

const TagList = styled.ul`
  padding: 0;
  list-style-type: none;

  li {
    display: inline-block;
    vertical-align: top;
  }
`;

const Tag = styled(Link)`
  /* color: ${props => props.color} !important; */
  border-color: ${props => props.color} !important;
  user-select: none;
  padding: 7px 0px 7px 10px;

  i {
    opacity: 0.5;
  }

  &:hover i{
    opacity: 0.8;
  }
`;

// const Icon = styled(FontAwesomeIcon)`

// `;

// const X = styled.span`
//   color: grey;
//   &:hover {
//     color: black;
//   }
// `;

export default function RepoTags() {
  const [selection, setSelection] = useSelection();

  return (
    <div className="mt3">
      <TagList>
        {[...selection].map((pkg, i) => (
          <li key={pkg}>
            <Tag
              color={color(i, 1)}
              to={withoutRepo(selection, pkg)}
              className="inline-block ba bw1 br2 fw3 near-black no-underline mr2 flex items-center"
            >
              <span>{pkg}</span>
              <i className="icon icon-cross mh2 black" />
              {/* <FontAwesomeIcon className="ml2" color="gray" icon={faTimes} /> */}
            </Tag>
          </li>
        ))}
      </TagList>
    </div>
  );
}
