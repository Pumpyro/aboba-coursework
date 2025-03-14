import React from "react";
import styles from "./Card.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const Card = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  return (
    <div className={styles.card}>
      <img
        src={`http://localhost:8080${product.imageUrl}`}
        alt={product.name}
        className={styles.image}
      />
      <div className={styles.details}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>Цена: {product.price} руб.</p>
      </div>
      <button
          onClick={() => addToCart(product)}
          className={styles.btn}
          disabled={!isAuthenticated}
        >
          Добавить в корзину
        </button>
    </div>
  );
};

export default Card;
