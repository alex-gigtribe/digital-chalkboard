// frontend/src/components/stats-panel/KPITiles.tsx
import { useStats } from "../context/StatsContext";

export default function KPITiles() {
  const { comparison, loading } = useStats();

  if (!comparison) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between animate-pulse"
          >
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
          </div>
        ))}
      </div>
    );
  }

  const tiles = [
    {
      label: "Total Bins",
      sublabel: "Total Bins Harvested",
      value: comparison.bins.current,
      change: comparison.bins.change,
      isPositive: comparison.bins.isPositive
    },
    {
      label: "Active Pickers",
      sublabel: "Active Pickers",
      value: comparison.pickers.current,
      change: comparison.pickers.change,
      isPositive: comparison.pickers.isPositive
    },
    {
      label: "Daily Target Progress",
      sublabel: "Daily Target Progress",
      value: `${comparison.targetProgress.current.toFixed(1)}%`,
      change: comparison.targetProgress.change,
      isPositive: comparison.targetProgress.isPositive
    },
    {
      label: "QC Flags",
      sublabel: "QC Flags",
      value: comparison.qcFlags.current,
      change: comparison.qcFlags.change,
      isPositive: comparison.qcFlags.isPositive
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((tile, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between"
        >
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-navy mb-1">
              {tile.value}
            </span>
            <span className="text-sm text-gray-600 mb-2">
              {tile.sublabel}
            </span>
            <span 
              className={`text-xs font-medium ${
                tile.change === "N/A" 
                  ? "text-gray-400" 
                  : tile.isPositive 
                    ? "text-green-600" 
                    : "text-red-600"
              }`}
            >
              {tile.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}