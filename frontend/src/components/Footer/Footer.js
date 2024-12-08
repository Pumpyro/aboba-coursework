import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className = {styles.paragraph}>&copy; {new Date().getFullYear()} А-Боба. Все права защищены.</p>
      <div className = {styles.footerButtons}>
        <Link to="/feedback" className = {styles.footerButton}>Оставить отзыв</Link>
        <Link to="/partnership" className = {styles.footerButton}>Сотрудничество</Link>
      </div>
    </footer>
  );
}

export default Footer;
