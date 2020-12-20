import React from "react";

export default function Container({ fluid, children }) {
  const cls = fluid ? "container-fluid" : "container";
  return <div className={cls}>{children}</div>;
}
