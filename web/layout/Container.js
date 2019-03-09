import React from "react";

const Container = ({ children, style }) => {
  return (
    <div className="container" style={style}>
      {children}
    </div>
  );
};

export default Container;
