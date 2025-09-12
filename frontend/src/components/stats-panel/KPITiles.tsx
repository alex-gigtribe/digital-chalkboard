import { KPIStats } from "@/api/stats";

type KPITilesProps = {
  stats: KPIStats | null;
};

export default function KPITiles({ stats }: KPITilesProps) {
  const placeholders = [
    { label: "Total Bins", value: stats?.today.bins ?? 0 },
    { label: "Active Pickers", value: stats?.today.pickers ?? 0 },
    {
      label: "Daily Target Progress",
      value: `${stats ? ((stats.today.bins / stats.today.target) * 100).toFixed(1) : 0}%`,
    },
    { label: "QC Flags", value: stats?.today.qcFlags ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {placeholders.map((tile, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between"
        >
          <span className="text-2xl font-bold text-navy">{tile.value}</span>
          <span className="text-sm text-gray-600">{tile.label}</span>
        </div>
      ))}
    </div>
  );
}
