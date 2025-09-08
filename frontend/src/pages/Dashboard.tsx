// src/pages/Dashboard.tsx
import { KPITiles } from "../components/stats-panel/KPITiles";
import { KPITable } from "../components/stats-panel/KPITable";
import { useDepot } from "../components/context/DepotContext";

export function Dashboard() {
  const { depot } = useDepot();

  return (
    <div className="bg-background min-h-screen">
      <div className="layout-container px-12 md:px-18 lg:px-24 py-8 space-y-6">
        <KPITiles />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-navy text-lg font-semibold">Depot Performance — {depot}</h2>
        </div>
        <KPITable />
      </div>
    </div>
  );
}
export default Dashboard;