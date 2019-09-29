// @flow
import React from "react";
import type { Node } from "react";

import "tachyons/css/tachyons.min.css";
import "../styles/global.css";
import "../styles/icons.css";

import Header from "./Header";

type Props = { children?: Node };

export default function Layout({ children }: Props) {
  return (
    <>
      <div className="sans-serif mw8 ph4 center">
        <Header />
        {children}
      </div>
    </>
  );
}
