import React, { useState } from "react";
import ProductList from "../components/ProductList/ProductList";
import Filters from "../components/Filters/Filters";

function Menu() {
  const [filters, setFilters] = useState({});

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Меню ресторана</h1>
      <Filters onApplyFilters={handleApplyFilters} />
      <ProductList filters={filters} />
    </div>
  );
}

export default Menu;
