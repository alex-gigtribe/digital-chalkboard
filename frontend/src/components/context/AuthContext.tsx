// frontend/src/components/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken } from "@/api/axiosClient";



type AuthContextType = {
  user: SecurityGroupUser | null;
  token: string | null;
  login: (user: SecurityGroupUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SecurityGroupUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Restore from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    const savedToken = localStorage.getItem("authToken");
    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser) as SecurityGroupUser;
      setUser(parsedUser);
      setToken(savedToken);
      setAuthToken(savedToken);
    }
  }, []);

  const login = (newUser: SecurityGroupUser, authToken: string) => {
    setUser(newUser);
    setToken(authToken);
    localStorage.setItem("authUser", JSON.stringify(newUser));
    localStorage.setItem("authToken", authToken); // ✅ persist token
    setAuthToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken"); // ✅ clear token
    setAuthToken(null);
    localStorage.removeItem("lockedDepot");
    window.dispatchEvent(new Event("depotCleared"));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
