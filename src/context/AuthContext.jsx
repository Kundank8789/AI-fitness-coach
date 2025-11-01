import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("afc_user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    try { localStorage.setItem("afc_user", JSON.stringify(userData)); } catch(e){}
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem("afc_user"); } catch(e){}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
