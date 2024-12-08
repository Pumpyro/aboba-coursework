import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import styles from "./ProductList.module.css";

function ProductList({ filters, isModerator = false }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams({
        page,
        size: 8, // Количество продуктов на странице
        ...filters, // Фильтры, переданные как пропсы
      });

      try {
        const response = await fetch(
          `http://localhost:8080/api/products?${queryParams.toString()}`
        );
        const data = await response.json();
        setProducts(data.content);
        setTotalPages(data.page.totalPages);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
      }
    };

    fetchProducts();
  }, [page, filters]);


  const handleDelete = async (productId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот продукт?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/delete/${productId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
          );
          alert("Продукт успешно удален.");
        } else {
          const error = await response.text();
          console.error("Ошибка при удалении продукта:", error);
          alert("Не удалось удалить продукт. Попробуйте снова.");
        }
      } catch (error) {
        console.error("Ошибка при удалении продукта:", error);
        alert("Ошибка сервера. Попробуйте снова.");
      }
    }
  };

  return (
    <div>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className = {styles.productCard}>
            <Card key={product.id} product={product} />
            {isModerator && (
              <button onClick={() => handleDelete(product.id)} className ={styles.deleteButton}>Удалить</button>
            )}
          </div>
        ))}
      </div>
      {!(products.length===0) ?
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
    </div> : <p className={styles.paragraph}>Ничего не найдено!</p>}
    </div>
  );
}

export default ProductList;
