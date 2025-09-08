import { KPITiles } from "../components/stats-panel/KPITiles";
import { KPITable } from "../components/stats-panel/KPITable";

export function Dashboard() {
  return (
    <div className="bg-background min-h-screen">
      <div className="layout-container px-12 md:px-18 lg:px-24 py-8 space-y-6">
        {/* KPI Tiles */}
        <KPITiles />

        {/* Filters row (placeholder for search/sort later) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-navy text-lg font-semibold">Depot Performance</h2>
        </div>

        {/* KPI Table */}
        <KPITable />
      </div>
    </div>
  );
}
