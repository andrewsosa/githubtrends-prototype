import React from "react";
import styles from "../../node_modules/spectre.css/dist/spectre.css";

const Container = ({ children, style }) => {
  return (
    <div className={styles.container} style={style}>
      {children}
    </div>
  );
};

export default Container;
