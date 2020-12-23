import React from "react";

import styles from "./Select.module.css";

export default function Select({ id, value, onChange, children }) {
  return (
    <span
      id={id}
      className={styles.selectSpan}
      // className={styles.selectContainer}
    >
      <select
        // className={styles.chartHeadingSelect}
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </span>
  );
}
