import React from "react";
import { PulseLoader } from "react-spinners";
import styles from "./RepoBadge.module.css";

export const BadgeList = ({ children }) => (
  <div className={styles.listWrapper}>
    <ul className={styles.list}>{children}</ul>
  </div>
);

export const RepoBadge = ({ name, isLoading, color, onX }) => (
  <li className={styles.badge}>
    <span>
      <a className="text-reset">
        <span>{name}</span>
        {isLoading ? (
          <div onClick={() => onX(name)}>
            <PulseLoader loading={isLoading} size={4} color={"lightgray"} />
          </div>
        ) : (
          <i onClick={() => onX(name)}>&times;</i>
        )}
      </a>
    </span>
  </li>
);
