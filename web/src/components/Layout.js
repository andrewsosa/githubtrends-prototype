// @flow
import React from "react";
import type { Node } from "react";

import Header from "./Header";

type Props = { children?: Node };

export default function Layout({ children }: Props) {
  return (
    <>
      <div className="sans-serif mw8 center">
        <Header />
        {children}
      </div>
    </>
  );
}
