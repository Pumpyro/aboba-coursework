import React, { useState } from "react";
import styles from "./ProductForm.module.css";

function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState(null); // Для хранения изображения
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Сохраняем выбранный файл
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);

    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:8080/api/products/add", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setMessage("Продукт успешно добавлен!");
        setIsSuccess(true);
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
        });
        setImage(null); // Сбрасываем выбранное изображение
      } else {
        const error = await response.text();
        setMessage(`Ошибка: ${error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Ошибка при добавлении продукта:", error);
      setMessage("Ошибка при добавлении продукта.");
      setIsSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <input
        className={styles.inputField}
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Название продукта"
        required
      />
      <input
        className={styles.inputField}
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Описание"
        required
      />
      <input
        className={styles.inputField}
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Цена"
        required
      />
      <input
        className={styles.inputField}
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Категория"
        required
      />
      <input
        className={styles.inputField}
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        required
      />
      <button type="submit" className={styles.submitButton}>Добавить продукт</button>
      {message && <p className={`${styles.message} ${
            isSuccess ? styles.success : styles.error
          }`}>{message}</p>}
    </form>
  );
}

export default ProductForm;
