import { useState, useEffect } from "react";
import KPITiles from "../components/stats-panel/KPITiles";
import KPITable from "../components/stats-panel/KPITable";
import { useDepot } from "../components/context/DepotContext";
// import { fetchStats } from "@/api/stats";
// import { fetchTeams } from "@/api/teams";
import LoadingOverlay from "../components/ui/LoadingOverlay";
// import type { KPIStats } from "@/api/stats";

export default function Dashboard() {
  const { selectedDepot } = useDepot();
  const [stats, setStats] = useState<KPIStats | null>(null);
  const [loading, setLoading] = useState(false); // ⬅ start as false

  useEffect(() => {
    if (!selectedDepot) return; // ⬅ do nothing until depot is picked
    setLoading(true);

    const load = async () => {
      try {
        const data = await fetchStats(selectedDepot.name);
        setStats(data);
        await fetchTeams(selectedDepot.id, selectedDepot.name); // warm up teams cache
      } catch (e) {
        console.warn("Dashboard load failed:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [selectedDepot]);

  //  If no depot selected yet, show a message instead of loading forever
  if (!selectedDepot) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-gray-500 text-center space-y-2">
          <p className="text-lg font-semibold">No Depot Selected</p>
          <p className="text-sm">Please choose a depot to view performance data.</p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingOverlay />;

  return (
    <div className="bg-white min-h-screen">
      <div className="layout-container px-12 md:px-18 lg:px-24 py-8 space-y-6">
        <KPITiles stats={stats} />
        <h2 className="text-navy text-lg font-semibold">
          Depot Performance — {selectedDepot.name}
        </h2>
        <KPITable />
      </div>
    </div>
  );
}
