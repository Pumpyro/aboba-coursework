import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Profile.module.css";

function Profile() {
  const { accessToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/account/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phoneNumber: data.phoneNumber || "",
          });
        } else {
          setError("Не удалось загрузить данные пользователя.");
        }
      } catch (error) {
        setError("Ошибка при загрузке данных пользователя.");
        console.error(error);
      }
    };

    fetchUserData();
  }, [accessToken]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Save updated user data
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/account/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedData = { ...userData, ...formData };
        setUserData(updatedData);
        setIsEditing(false);
        setSuccessMessage("Данные успешно обновлены.");
      } else {
        setError("Ошибка при обновлении данных.");
      }
    } catch (error) {
      setError("Ошибка при запросе на сервер.");
      console.error(error);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async () => {
    try {
        console.log(JSON.stringify(passwordData));
      const response = await fetch("http://localhost:8080/api/account/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        setSuccessMessage("Пароль успешно изменен.");
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const errorResponse = await response.text();
        console.error("Ошибка сервера:", errorResponse);
        setError("Ошибка при смене пароля. Проверьте введенные данные.");
      }
    } catch (error) {
      setError("Ошибка при запросе на сервер.");
      console.error(error);
    }
  };

  if (!userData) {
    return <p>Загрузка данных...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.title}>Профиль пользователя</h1>
        {error && <p className={styles.errorMessage} style={{ color: "red" }}>{error}</p>}
        {successMessage && <p className={styles.successMessage} style={{ color: "green" }}>{successMessage}</p>}
        <div className={styles.section}>
          <p className={styles.info}>Имя пользователя: {userData.username}</p>
          <p className={styles.info}>Email: {userData.email}</p>
          {isEditing ? (
            <>
              <input
                className={styles.input}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Имя"
              />
              <input
                className={styles.input}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Фамилия"
              />
              <input
                className={styles.input}
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Телефон"
              />
              <button className={styles.button} onClick={handleSave}>Сохранить</button>
              <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => setIsEditing(false)}>Отменить</button>
            </>
          ) : (
            <>
              <p className={styles.info}>Имя: {userData.firstName || "Не указано"}</p>
              <p className={styles.info}>Фамилия: {userData.lastName || "Не указано"}</p>
              <p className={styles.info}>Телефон: {userData.phoneNumber || "Не указано"}</p>
              <button className={styles.button} onClick={() => setIsEditing(true)}>Редактировать</button>
            </>
          )}
        </div>
        <div className={styles.section}>
          <button className={styles.button} onClick={() => setIsChangingPassword(!isChangingPassword)}>
            {isChangingPassword ? "Отмена" : "Сменить пароль"}
          </button>
          {isChangingPassword && (
            <div>
              <input
                className={styles.input}
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Текущий пароль"
              />
              <input
                className={styles.input}
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Новый пароль"
              />
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Подтвердите новый пароль"
              />
              <button className={styles.button} onClick={handlePasswordSubmit}>Сохранить пароль</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
