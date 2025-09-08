import { createContext, useContext, useState, ReactNode } from "react";

const DEPOTS = [
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

export function DepotProvider({ children }: { children: ReactNode }) {
  const [depot, setDepot] = useState(DEPOTS[0]);
  return (
    <DepotContext.Provider value={{ depot, setDepot, DEPOTS }}>
      {children}
    </DepotContext.Provider>
  );
}

export function useDepot() {
  const ctx = useContext(DepotContext);
  if (!ctx) throw new Error("useDepot must be inside DepotProvider");
  return ctx;
}
