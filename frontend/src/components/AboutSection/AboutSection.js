import React from "react";
import styles from "./AboutSection.module.css";

function AboutSection() {
  return (
    <section className={styles.about}>
      <h2>О нашем рестобаре</h2>
      <p>
        "А-боба" – это современный рестобар, где классика встречается с
        инновациями. Мы предлагаем вам меню, созданное с любовью и вниманием к
        деталям, чтобы каждый ваш визит был особенным.
      </p>
      <blockquote className={styles.quote}>
        "Мы стремимся не только удовлетворить ваши вкусовые предпочтения, но и
        удивить их." – Шеф-повар
      </blockquote>
    </section>
  );
}

export default AboutSection;
