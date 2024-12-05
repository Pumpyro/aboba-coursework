import React, { useState } from "react";
import Modal from "react-modal";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./PaymentModal.module.css";


function PaymentModal({ isOpen, onClose }) {
  const { cart, clearCart, getTotalPrice } = useCart();
  const { accessToken } = useAuth();
  const [accountNumber, setAccountNumber] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    if (!accountNumber || !pinCode) {
        alert("Пожалуйста, введите номер счета и пин-код");
        return;
    }
    setLoading(true);
    const products = cart.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {});

    const paymentRequest = {
      accountNumber,
      pinCode,
      orderAmount: getTotalPrice(),
      products,
      deliveryAddress,
    };

    try {
      const response = await fetch("http://localhost:8080/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`},
        body: JSON.stringify(paymentRequest),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.text();
        setMessage(`${data}`);
        clearCart(); // Очистить корзину после успешной оплаты
      } else {
        const error = await response.text();
        setMessage(`Ошибка: ${error}`);
      }
    } catch (error) {
      setMessage("Произошла ошибка при обработке платежа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Оплата заказа"
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <h2>Оплата</h2>
      <div className={styles.inputGroup}>
        <label>Номер счета</label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Пин-код</label>
        <input
          type="password"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          autoComplete = "off"
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Метод доставки</label>
        <div className={styles.radioGroup}>
          <label className={styles.method}>
            <input
              type="radio"
              name="deliveryMethod"
              value="pickup"
              checked={deliveryMethod === "pickup"}
              onChange={() => setDeliveryMethod("pickup")}
            />
            Самовывоз
          </label>
          <label className={styles.method}>
            <input
              type="radio"
              name="deliveryMethod"
              value="delivery"
              checked={deliveryMethod === "delivery"}
              onChange={() => setDeliveryMethod("delivery")}
            />
            Доставка
          </label>
        </div>
      </div>
      {deliveryMethod === "delivery" && (
        <div className={styles.inputGroup}>
          <label>Адрес доставки</label>
          <input
            type="text"
            value={deliveryAddress || ""}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Введите адрес"
          />
        </div>
      )}
      <div className={styles.actions}>
        <button onClick={onClose} className={styles.closeButton}>
          Отмена
        </button>
        <button
          onClick={handlePayment}
          className={styles.payButton}
          disabled={loading || cart.length === 0}
        >
          {loading ? "Оплата..." : "Оплатить"}
        </button>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </Modal>
  );
}

export default PaymentModal;
