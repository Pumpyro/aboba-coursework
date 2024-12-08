import React, { useState } from "react";
import styles from "./PartnershipPage.module.css";

function PartnershipPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    customerPhone: "",
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
      const response = await fetch("http://localhost:8080/api/partnerships/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessage("Спасибо за ваше обращение! Мы свяжемся с вами.");
        setFormData({ firstName: "", lastName: "", customerPhone: "", content: "" });
      } else {
        const errorText = await response.text();
        setMessage(`Ошибка: ${errorText}`);
      }
    } catch (error) {
      setMessage("Ошибка при отправке заявки.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Сотрудничество</h1>
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
        <input
          className={styles.input}
          type="text"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          placeholder="Телефон"
          required
        />
        <textarea
          className={styles.textarea}
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Текст заявки"
          required
        />
        <button type="submit" className={styles.btn}>Отправить</button>
      </form>
      {message && <p className={styles.paragraph}>{message}</p>}
    </div>
  );
}

export default PartnershipPage;
