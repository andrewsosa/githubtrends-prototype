import React from "react";

import Container from "./Container";

const Section = ({ children, style }) => {
  return (
    <div className="section" style={style}>
      <Container>{children}</Container>
    </div>
  );
};

export default Section;
