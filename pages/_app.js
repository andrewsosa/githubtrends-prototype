import React from "react";
import "halfmoon/css/halfmoon.min.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
