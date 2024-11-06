import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./LoginModal.module.css";
import { useAuth } from "../../contexts/AuthContext";

function LoginModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(username, password);
      closeModal();
    } catch (error) {
      console.error(error);
      setErrorMessage("Неверный логин или пароль");
    }
  }

  function closeModal() {
    setErrorMessage("");
    onClose();
  }

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <button onClick={closeModal} className={styles.closeButton}>
        &times;
      </button>
      <h2>Войти</h2>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
    </Modal>
  );
}

export default LoginModal;
