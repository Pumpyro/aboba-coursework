import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken && isTokenExpired(accessToken)){
        refreshAccessToken();
      }
    }, 5*60*1000);
    return () => clearInterval(interval);
  }, [accessToken]);

  const isTokenExpired = (token) =>{
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.accessToken;
        setAccessToken(token);
        localStorage.setItem("accessToken", token);
        setIsAuthenticated(true);
      } else {
        throw new Error("Неверный логин или пароль");
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.accessToken;
        setAccessToken(newToken);
        localStorage.setItem("accessToken", newToken);
        return newToken;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      console.error("Ошибка при обновлении access token:", error);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        accessToken,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
