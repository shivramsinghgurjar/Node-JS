import React, { createContext, useEffect, useState } from "react";
import { setAuthToken } from "../services/api";
import { me as getMe, logout as apiLogout } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      getMe()
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem("token");
          setAuthToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (token) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
    // load user profile
    getMe()
      .then((res) => setUser(res.data.data))
      .catch(() => {});
  };

  const logoutUser = async () => {
    try {
      await apiLogout();
    } catch (e) {
      /* ignore */
    }
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
