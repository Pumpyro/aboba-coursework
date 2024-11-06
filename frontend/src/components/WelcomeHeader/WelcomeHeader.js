import React from "react";
import styles from "./WelcomeHeader.module.css";

function WelcomeHeader() {
  return (
    <header className={styles.header}>
      <h1>
        Добро пожаловать в "А-боба" – ваш уютный уголок для наслаждения
        изысканными блюдами и напитками!
      </h1>
      <p>
        Испытайте уникальные вкусы, атмосферу и гостеприимство нашего ресторана.
      </p>
    </header>
  );
}

export default WelcomeHeader;
