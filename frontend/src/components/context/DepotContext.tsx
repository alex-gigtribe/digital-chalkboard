// src/context/DepotContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export const DEPOTS = [
  "Hutton Squire 1",
  "Hutton Squire 2",
  "Hutton Squire 3",
  "Hutton Squire 4",
  "Hutton Squire 5",
  "Hutton Squire 6",
];

interface DepotContextType {
  depot: string;
  setDepot: (d: string) => void;
  DEPOTS: string[];
}

const DepotContext = createContext<DepotContextType | undefined>(undefined);

const STORAGE_KEY = "adagin_selected_depot";

export function DepotProvider({ children }: { children: ReactNode }) {
  const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  const initial = stored ?? DEPOTS[0];
  const [depot, setDepotRaw] = useState<string>(initial);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, depot); } catch {}
  }, [depot]);

  const setDepot = (d: string) => {
    setDepotRaw(d);
  };

  return (
    <DepotContext.Provider value={{ depot, setDepot, DEPOTS }}>
      {children}
    </DepotContext.Provider>
  );
}

export function useDepot() {
  const ctx = useContext(DepotContext);
  if (!ctx) throw new Error("useDepot must be used inside DepotProvider");
  return ctx;
}
