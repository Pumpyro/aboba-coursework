import Header from "./components/Header/Header";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import FeedbackPage from "./pages/FeedbackPage/FeedbackPage";
import PartnershipPage from "./pages/PartnershipPage/PartnershipPage";
import LoginModal from "./components/LoginModal/LoginModal";
import RegisterModal from "./components/RegisterModal/RegisterModal";
import ReservationModal from "./components/ReservationModal/ReservationModal";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer/Footer";
import { CartProvider } from "./contexts/CartContext";
import ModeratorPage from "./pages/ModeratorPage";

function App() {
  const [isLoginOpen, setLoginOpen] = React.useState(false);
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);
  const [isReservationOpen, setReservationOpen] = React.useState(false);

  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <Header
            onReservationClick={() => setReservationOpen(true)}
            onLoginClick={() => setLoginOpen(true)}
            onRegisterClick={() => setRegisterOpen(true)}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/partnership" element={<PartnershipPage />} />
            <Route path="/moderator" element={<ModeratorPage /> } />
          </Routes>
          {isLoginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
          {isRegisterOpen && (
            <RegisterModal onClose={() => setRegisterOpen(false)} />
          )}
          <ReservationModal
          isOpen={isReservationOpen}
          onClose={() => setReservationOpen(false)}
          />
          <Footer />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
