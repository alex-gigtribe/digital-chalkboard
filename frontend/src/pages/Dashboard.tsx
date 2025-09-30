// frontend/src/pages/Dashboard.tsx
import KPITiles from "../components/stats-panel/KPITiles";
import KPITable from "../components/stats-panel/KPITable";
import KPIVariety from "../components/stats-panel/KPIVariety";
import KPIQCissues from "../components/stats-panel/KPIQCissues";
import { useDepot } from "../components/context/DepotContext";
import { useStats } from "../components/context/StatsContext";
import LoadingOverlay from "../components/ui/LoadingOverlay";

export default function Dashboard() {
  const { selectedDepot } = useDepot();
  const { loading } = useStats();

  // If no depot selected yet, show a message instead of loading forever
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
        <KPITiles />
        
        <h2 className="text-navy text-lg font-semibold">
          Depot Performance — {selectedDepot.name}
        </h2>
        
        <KPITable />
        
        {/* Side-by-side tables for Variety and QC Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KPIVariety />
          <KPIQCissues />
        </div>
      </div>
    </div>
  );
}