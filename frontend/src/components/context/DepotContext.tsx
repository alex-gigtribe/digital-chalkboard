// src/components/context/DepotContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { Depot, fetchDepots } from "@/api/depots";
import Toast from "../ui/Toast";

type DepotContextType = {
  depots: Depot[];
  selectedDepot: Depot | null;
  setSelectedDepot: (depot: Depot) => void;
  reloadDepots: () => Promise<void>;
  hydrated: boolean; // ✅ new flag
};

const DepotContext = createContext<DepotContextType | undefined>(undefined);

export function DepotProvider({ children }: { children: React.ReactNode }) {
  const [depots, setDepots] = useState<Depot[]>([]);
  const [selectedDepot, setSelectedDepotState] = useState<Depot | null>(null);
  const [hydrated, setHydrated] = useState(false); // ✅ start false
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      await reloadDepots();

      const savedDepot = localStorage.getItem("lockedDepot");
      if (savedDepot) {
        try {
          setSelectedDepotState(JSON.parse(savedDepot));
        } catch {
          localStorage.removeItem("lockedDepot");
        }
      }
      setHydrated(true); // ✅ only mark done once state is restored
    };

    init();

    const handleDepotClear = () => {
      setSelectedDepotState(null);
      setToastMessage("Depot lock cleared. Please reselect after login.");
    };

    window.addEventListener("depotCleared", handleDepotClear);
    return () => {
      window.removeEventListener("depotCleared", handleDepotClear);
    };
  }, []);

  const reloadDepots = async () => {
    const data = await fetchDepots();
    setDepots(data);
  };

  const setSelectedDepot = (depot: Depot) => {
    setSelectedDepotState(depot);
    localStorage.setItem("lockedDepot", JSON.stringify(depot));
  };

  return (
    <DepotContext.Provider value={{ depots, selectedDepot, setSelectedDepot, reloadDepots, hydrated }}>
      {hydrated ? children : null} {/* ✅ Don't render children until restored */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </DepotContext.Provider>
  );
}

export const useDepot = () => {
  const context = useContext(DepotContext);
  if (!context) throw new Error("useDepot must be used within a DepotProvider");
  return context;
};
