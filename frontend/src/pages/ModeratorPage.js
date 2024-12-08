import React, {useState} from "react";
import { useAuth } from "../contexts/AuthContext";
import ProductForm from "../components/ProductForm/ProductForm";
import ProductList from "../components/ProductList/ProductList";
import Filters from "../components/Filters/Filters";
import { hasRole } from "../utils/roleCheck";
import { Navigate } from "react-router-dom";

function ModeratorPage() {
    const [filters, setFilters] = useState({});
    const { accessToken } = useAuth();
    if (!hasRole(accessToken, "MODERATOR")){
        return <Navigate to="/" replace />;
    }
    const handleApplyFilters = (appliedFilters) => {
        setFilters(appliedFilters);
      };

    return (
        <div>
        <h1 style={{ textAlign: "center"}}>Модераторская панель</h1>
        <ProductForm />
        <Filters onApplyFilters={handleApplyFilters} />
        <ProductList filters={filters} isModerator={true} />
        </div>
        );
}

export default ModeratorPage;
