// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { KPITiles } from "../components/stats-panel/KPITiles";
import { KPITable } from "../components/stats-panel/KPITable";
import { useDepot } from "../components/context/DepotContext";
import { fetchStats } from "@/api/stats";
import { fetchTeams } from "@/api/teams"; //  FIXED: now imported from teams API
import LoadingOverlay from "../components/ui/LoadingOverlay";

export function Dashboard() {
  const { selectedDepot } = useDepot();
  const [loading, setLoading] = useState(true);

  // Fake initial load until first fetch completes
  useEffect(() => {
    if (!selectedDepot) return;
    const loadInitial = async () => {
      try {
        await Promise.all([
          fetchStats(selectedDepot.name),
          fetchTeams(undefined, selectedDepot.name),
        ]);
      } catch (e) {
        console.warn("Initial dashboard load failed:", e);
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, [selectedDepot]);

  if (loading) return <LoadingOverlay />;

  return (
    <div className="bg-background min-h-screen">
      <div className="layout-container px-12 md:px-18 lg:px-24 py-8 space-y-6">
        <KPITiles />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-navy text-lg font-semibold">
            Depot Performance — {selectedDepot?.name ?? ""}
          </h2>
        </div>
        <KPITable />
      </div>
    </div>
  );
}

export default Dashboard;
