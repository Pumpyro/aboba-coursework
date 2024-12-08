import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./ReservationModal.module.css";
import { useAuth } from "../../contexts/AuthContext";


function ReservationModal({ isOpen, onClose }) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    tableId: "",
    customerName: "",
    customerPhone: "",
    numberOfPeople: "",
    timeStart: "",
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAvailableTables = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tables/available");
        if (response.ok) {
          const tables = await response.json();
          setAvailableTables(tables);
          if (tables.length === 0){
            setMessage("На данный момент все столики заняты. Попробуйте позже.");
          } else{
            setMessage("");
          }
        } else {
          setMessage("Не удалось загрузить доступные столики.");
        }
      } catch (error) {
        setMessage("Ошибка при загрузке доступных столиков.");
      }
    };

    fetchAvailableTables();

    const interval = setInterval(fetchAvailableTables, 30*1000);
    return () => clearInterval(interval);
  }, []);

  const isValidPhoneNumber = (phone) => {
    const phoneReg = /^\+7\d{10}$/;
    return phoneReg.test(phone);
  }

  const validateForm = () => {
    const newErrors = {};
    const selectedTable = availableTables.find((table) => table.id.toString() === formData.tableId);
    if (!selectedTable) {
        setMessage("Выбранный столик не найден.");
        return false;
      }
    
      if (!formData.customerName) {
        setMessage("Имя клиента обязательно.");
        return false;
      }
    
      if (!formData.customerPhone) {
        setMessage("Телефон обязателен.");
        return false;
      }
    
      if (!isValidPhoneNumber(formData.customerPhone)) {
        setMessage("Введите телефон в формате +7XXXXXXXXXX.");
        return false;
      }
    
      if (!formData.numberOfPeople) {
        setMessage("Укажите количество человек.");
        return false;
      }
    const numPeople = parseInt(formData.numberOfPeople, 10);
    if (numPeople > selectedTable.capacity){
        setMessage(`Столик вмещает максимум ${selectedTable.capacity} человека.`)
        return false;
    }
    setMessage("Заполните все обязательные поля.");
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReservation = async () => {
    if (!validateForm()){
        return;
    }
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (accessToken){
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      const response = await fetch("http://localhost:8080/api/reservations/book", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Бронирование успешно создано!");
        setFormData({
          tableId: "",
          customerName: "",
          customerPhone: "",
          numberOfPeople: "",
          timeStart: "",
        });
      } else {
        const error = await response.text();
        setMessage(`Ошибка: ${error}`);
      }
    } catch (error) {
      setMessage("Произошла ошибка при бронировании.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Бронирование столика"
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <h2>Бронирование столика</h2>
      {availableTables.length === 0 ? (
        <p></p>
      ) : (
        <>
          <div className={styles.inputGroup}>
            <label>Выберите столик</label>
            <select
              name="tableId"
              value={formData.tableId}
              onChange={handleChange}
              required
            >
              <option value="">Выберите столик</option>
              {availableTables.map((table) => (
                <option key={table.id} value={table.id}>
                  Столик {table.id} ({table.capacity} места)
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Имя клиента</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Телефон</label>
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Количество человек</label>
            <input
              type="number"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Дата и время</label>
            <input
              type="datetime-local"
              name="timeStart"
              value={formData.timeStart}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.actions}>
            <button onClick={onClose} className={styles.closeButton}>
              Отмена
            </button>
            <button
              onClick={handleReservation}
              className={styles.reserveButton}
              disabled={!formData.tableId}
            >
              Забронировать
            </button>
          </div>
        </>
      )}
      {message && <p className={styles.message}>{message}</p>}
    </Modal>
  );
}

export default ReservationModal;
