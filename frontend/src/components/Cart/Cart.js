import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import PaymentModal from "../PaymentModal/PaymentModal";
import styles from "./Cart.module.css";

function Cart() {
  const { cart, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.heading}>Корзина</h1>
      {cart.length === 0 ? (
        <p className={styles.paragraph}>Корзина пуста :c</p>
      ) : (
        <>
          <ul className={styles.cartItems}>
            {cart.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span>
                    {item.price.toFixed(2)} × {item.quantity} шт.
                  </span>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemove(item.id)}
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.cartSummary}>
            <span className={styles.totalPrice}>
              Общая сумма: {getTotalPrice().toFixed(2)} ₽
            </span>
            <div className={styles.cartActions}>
              <button
                onClick={handleOpenModal}
                className={styles.checkoutButton}
              >
                Оплатить
              </button>
              <button onClick={handleClearCart} className={styles.clearButton}>
                Очистить корзину
              </button>
            </div>
          </div>
        </>
      )}
      <PaymentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default Cart;
