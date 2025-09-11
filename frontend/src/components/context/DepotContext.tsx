// src/components/context/DepotContext.tsx
import React, { createContext, useContext, useState } from "react";

type DepotContextType = {
  depot: string;
  setDepot: (depot: string) => void;
};

// ✅ Example list of depots — replace with API fetch later
export const DEPOTS = ["Depot A", "Depot B", "Depot C"];

const DepotContext = createContext<DepotContextType | undefined>(undefined);

export const DepotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [depot, setDepot] = useState<string>(DEPOTS[0]); // Default to first depot

  return (
    <DepotContext.Provider value={{ depot, setDepot }}>
      {children}
    </DepotContext.Provider>
  );
};

export const useDepot = () => {
  const context = useContext(DepotContext);
  if (!context) {
    throw new Error("useDepot must be used inside DepotProvider");
  }
  return context;
};
