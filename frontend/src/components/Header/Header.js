import React from "react";

import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Header({ onLoginClick, onRegisterClick }) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className={styles.header}>
      <nav className={styles.header__nav}>
        <ul className={styles.left_list}>
          <li className={styles.header__item}>
            <Link to="/">Главная</Link>
          </li>
          <li className={styles.header__item}>
            <Link to="/menu">Меню</Link>
          </li>
        </ul>
        <ul className={styles.right_list}>
          {!isAuthenticated ? (
            <>
              <li className={styles.header__item}>
                <button onClick={onLoginClick} className={styles.button}>
                  Войти
                </button>
              </li>
              <li className={styles.header__item}>
                <button onClick={onRegisterClick} className={styles.button}>
                  Регистрация
                </button>
              </li>
            </>
          ) : (
            <li className={styles.header__item}>
              <button onClick={logout} className={styles.button}>
                Выйти
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
