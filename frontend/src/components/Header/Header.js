import React from "react";

import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Header({ onLoginClick, onRegisterClick, onReservationClick}) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout(){
    logout();
    navigate("/");
  }

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
          {isAuthenticated && <li className={styles.header__item}>
            <Link to="/cart">Корзина</Link>
          </li>}
        </ul>
        <ul className={styles.right_list}>
          <li className={styles.header__item}>
            <button onClick={onReservationClick} className={styles.reservationButton}>
              Забронировать
            </button>
          </li>
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
            <div className={styles.right_list}>
              <li className={styles.header__item}>
                <Link to="/profile">Профиль</Link>
              </li>
              <li className={styles.header__item}>
                <button onClick={handleLogout} className={styles.button}>
                  Выйти
                </button>
              </li>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
