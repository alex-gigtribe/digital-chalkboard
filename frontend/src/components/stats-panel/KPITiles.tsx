// frontend/src/components/stats-panel/KPITiles.tsx
import { useEffect, useState } from "react";
import { fetchStats, transformToKPI, KPIStats, Stats } from "@/api/stats";
import { useDepot } from "../context/DepotContext";

export function KPITiles() {
  const { selectedDepot } = useDepot();
  const [kpis, setKpis] = useState<KPIStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch stats whenever depot changes
  useEffect(() => {
    if (!selectedDepot) return;

    let isMounted = true;
    const loadStats = async () => {
      try {
        setLoading(true);
        const stats: Stats = await fetchStats(selectedDepot.name);
        if (isMounted) setKpis(transformToKPI(stats));
      } catch (e) {
        console.warn("Failed to load KPI stats:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStats();

    // ✅ Poll every 30s for updates
    const interval = setInterval(loadStats, 30_000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedDepot]);

  // ✅ Always render tiles, even with empty placeholder data
  const tiles = [
    { key: "bins", ...kpis?.bins, value: kpis?.bins?.value ?? "--", label: "Total Bins Harvested" },
    { key: "pickers", ...kpis?.pickers, value: kpis?.pickers?.value ?? "--", label: "Active Pickers" },
    { key: "progress", ...kpis?.progress, value: kpis?.progress?.value ?? "--", label: "Daily Target Progress" },
    { key: "qcFlags", ...kpis?.qcFlags, value: kpis?.qcFlags?.value ?? "--", label: "QC Flags" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-6">
      {tiles.map((t) => (
        <div
          key={t.key}
          className="bg-white rounded-md shadow-subtle p-card flex flex-col justify-between"
        >
          <div className={`text-2xl font-bold ${t.color ?? "text-gray-400"}`}>
            {loading ? "..." : t.value}
          </div>
          <div className="text-sm text-navy/80">{t.label}</div>
          <div className="text-xs mt-1">
            {loading ? (
              <span className="text-gray-400">--</span>
            ) : (
              <span
                className={`${t.delta?.includes("-") ? "text-danger" : "text-success"} font-semibold`}
              >
                {t.delta ?? "--"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KPITiles;
