import React from "react";
import styles from "./MainBanner.module.css";

function MainBanner({ children }) {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.overlay}></div>
      <div className={styles.textContainer}>{children}</div>
    </div>
  );
}

export default MainBanner;
