import { createContext, useContext, useState, useEffect } from "react";
import { Depot, fetchDepots } from "@/api/depots";

type DepotContextType = {
  depots: Depot[];
  selectedDepot: Depot | null;
  setSelectedDepot: (depot: Depot) => void;
  reloadDepots: () => Promise<void>; // ✅ include this
};

const DepotContext = createContext<DepotContextType | undefined>(undefined);

export function DepotProvider({ children }: { children: React.ReactNode }) {
  const [depots, setDepots] = useState<Depot[]>([]);
  const [selectedDepot, setSelectedDepotState] = useState<Depot | null>(null);

  const reloadDepots = async () => {
    try {
      const data = await fetchDepots();
      setDepots(data);
    } catch (e) {
      console.error("Failed to load depots:", e);
      setDepots([]); // fallback to empty list
    }
  };

  useEffect(() => {
    reloadDepots();

    const savedDepot = localStorage.getItem("lockedDepot");
    if (savedDepot) {
      try {
        setSelectedDepotState(JSON.parse(savedDepot));
      } catch {
        localStorage.removeItem("lockedDepot");
      }
    }
  }, []);

  const setSelectedDepot = (depot: Depot) => {
    setSelectedDepotState(depot);
    localStorage.setItem("lockedDepot", JSON.stringify(depot));
  };

  return (
    <DepotContext.Provider value={{ depots, selectedDepot, setSelectedDepot, reloadDepots }}>
      {children}
    </DepotContext.Provider>
  );
}

export const useDepot = () => {
  const ctx = useContext(DepotContext);
  if (!ctx) throw new Error("useDepot must be used within a DepotProvider");
  return ctx;
};
