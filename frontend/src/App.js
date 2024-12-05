import Header from "./components/Header/Header";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import LoginModal from "./components/LoginModal/LoginModal";
import RegisterModal from "./components/RegisterModal/RegisterModal";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer/Footer";
import { CartProvider } from "./contexts/CartContext";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [isLoginOpen, setLoginOpen] = React.useState(false);
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header
            onLoginClick={() => setLoginOpen(true)}
            onRegisterClick={() => setRegisterOpen(true)}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          {isLoginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
          {isRegisterOpen && (
            <RegisterModal onClose={() => setRegisterOpen(false)} />
          )}
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
