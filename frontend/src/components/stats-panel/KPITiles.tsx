// src/components/stats-panel/KPITiles.tsx
import { getKPIs } from "../../data/mockStats";
import { useDepot } from "../context/DepotContext";

export function KPITiles() {
  const { depot } = useDepot();
  const kpis = getKPIs(depot);
  const tiles = [kpis.bins, kpis.pickers, kpis.progress, kpis.qcFlags];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-6">
      {tiles.map((t, idx) => (
        <div
          key={idx}
          className="bg-white rounded-md shadow-subtle p-card flex flex-col justify-between"
        >
          <div className={`text-2xl font-bold ${t.color}`}>{t.value}</div>
          <div className="text-sm text-navy/80">{t.label}</div>
          <div className="text-xs mt-1">
            <span
              className={`${t.delta.includes("-") ? "text-danger" : "text-success"} font-semibold`}
            >
              {t.delta.includes("%") ? t.delta : `${t.delta}`}
              {t.delta.includes("-") ? " ↓" : " ↑"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KPITiles;
