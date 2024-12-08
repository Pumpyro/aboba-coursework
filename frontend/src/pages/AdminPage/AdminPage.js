import React, { useState, useEffect } from "react";
import styles from "./AdminPage.module.css";
import {useAuth} from "../../contexts/AuthContext";


function AdminPage() {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    else if (activeTab === "feedbacks") fetchFeedbacks();
    else if (activeTab === "partnerships") fetchPartnerships();
  }, [activeTab, page]);
  
  const fetchUsers = async () => {
    try{
      const response = await fetch(`http://localhost:8080/api/account/users?page=${page}&size=8`);
      if (response.ok){
        const data = await response.json();
        setUsers(data.content);
        setTotalPages(data.page.totalPages);
      }else{
        console.error("Ошибка при загрузке пользователей");
      }
    }catch(error){
      console.error("Ошибка при загрузке пользователей:", error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews?page=${page}&size=10`
      );
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.content);
        setTotalPages(data.page.totalPages);
      } else {
        console.error("Ошибка при загрузке отзывов");
      }
    } catch (error) {
      console.error("Ошибка при загрузке отзывов:", error);
    }
  };

  const fetchPartnerships = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/partnerships?page=${page}&size=10`
      );
      if (response.ok) {
        const data = await response.json();
        setPartnerships(data.content);
        setTotalPages(data.page.totalPages);
      } else {
        console.error("Ошибка при загрузке заявок о сотрудничестве");
      }
    } catch (error) {
      console.error("Ошибка при загрузке заявок о сотрудничестве:", error);
    }
  };

  const deleteUser = async (id) => {
    const confirmation = window.confirm(
      "Вы уверены, что хотите удалить этого пользователя?"
    );

    if (!confirmation){
      return;
    }

    try {
      const headers = {};
      if (accessToken){
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      const response = await fetch(
        `http://localhost:8080/api/account/${id}`,
        { method: "DELETE",
          headers: headers,
         }
      );
      if (response.ok) {
        fetchUsers(); // Обновляем список после удаления
      } else {
        console.error("Ошибка при удалении пользователя");
      }
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.headings}>Админ Панель</h1>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "users" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("users")}
        >
          Пользователи
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "feedbacks" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("feedbacks")}
        >
          Отзывы
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "partnerships" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("partnerships")}
        >
          Заявки о сотрудничестве
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === "users" && (
          <div>
            <h2 className={styles.headings}>Пользователи</h2>
            <ul>
              {users.map((user) => (
                <li key={user.id} className={styles.item}>
                  {user.username}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className={styles.deleteButton}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "feedbacks" && (
          <div>
            <h2 className={styles.headings}>Отзывы</h2>
            <ul>
              {feedbacks.map((feedback) => (
                <li key={feedback.id} className={styles.item}>
                  <p>
                    <strong>{feedback.firstName} {feedback.lastName}</strong>
                  </p>
                  <p>{feedback.content}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "partnerships" && (
          <div>
            <h2 className={styles.headings}>Заявки о сотрудничестве</h2>
            <ul>
              {partnerships.map((partnership) => (
                <li key={partnership.id} className={styles.item}>
                  <p>
                    <strong>{partnership.firstName} {partnership.lastName}</strong>
                    <br />
                    Телефон: {partnership.customerPhone}
                  </p>
                  <p>{partnership.content}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.pagination}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className={styles.paginationButton}
        >
          Назад
        </button>
        <span>
          Страница {page + 1} из {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
          className={styles.paginationButton}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}

export default AdminPage;