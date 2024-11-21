import React, { useState } from "react";
import styles from "./Filters.module.css";

function Filters({ onApplyFilters }) {
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = {
    electronics: "Электроника",
    cloth: "Одежда",
  };

  const handleApplyFilters = () => {
    const filters = {};
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    onApplyFilters(filters);
  };

  return (
    <div className={styles.filtersContainer}>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={styles.filterSelect}
      >
        <option value="">Все категории</option>
        {Object.entries(categories).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
      <inputq
        type="number"
        placeholder="Минимальная цена"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className={styles.filterInput}
      />
      <input
        type="number"
        placeholder="Максимальная цена"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className={styles.filterInput}
      />
      <button onClick={handleApplyFilters} className={styles.applyFilterButton}>
        Применить фильтры
      </button>
    </div>
  );
}

export default Filters;
