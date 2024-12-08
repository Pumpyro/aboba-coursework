import React, { useState } from "react";
import styles from "./FeedbackPage.module.css";

function FeedbackPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    content: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/reviews/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessage("Спасибо за ваш отзыв!");
        setFormData({ firstName: "", lastName: "", feedback: "" });
      } else {
        const errorText = await response.text();
        setMessage(`Ошибка: ${errorText}`);
      }
    } catch (error) {
      setMessage("Ошибка при отправке отзыва.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Оставить отзыв</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Имя"
          required
        />
        <input
          className={styles.input}
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Фамилия"
          required
        />
        <textarea
          className={styles.textarea}
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Ваш отзыв"
          required
        />
        <button type="submit" className={styles.btn}>Отправить</button>
      </form>
      {message && <p className={styles.paragraph}>{message}</p>}
    </div>
  );
}

export default FeedbackPage;
