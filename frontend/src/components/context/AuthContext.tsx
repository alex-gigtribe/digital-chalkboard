import { createContext, useContext, useState, useEffect } from "react";

type User = {
  username: string;
  securityGroupId: string;
  depots: string[];
  depot: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setDepot: (depot: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Restore depot from localStorage on refresh
  useEffect(() => {
    const savedDepot = localStorage.getItem("lockedDepot");
    if (savedDepot && user) {
      setUser((prev) => (prev ? { ...prev, depot: savedDepot } : prev));
    }
  }, []);

  const login = (newUser: User, authToken: string) => {
    setUser(newUser);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("lockedDepot");
  };

  const setDepot = (depot: string) => {
    setUser((prev) => (prev ? { ...prev, depot } : prev));
    localStorage.setItem("lockedDepot", depot);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setDepot }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
