import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import styles from "./ProductList.module.css";

function ProductList({ filters }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams({
        page,
        size: 10, // Количество продуктов на странице
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

  return (
    <div>
      <div className={styles.productList}>
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
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

export default ProductList;
