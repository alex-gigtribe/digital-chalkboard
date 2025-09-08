import { mockTeams, withAvg } from "../../data/mockTeams";

export function KPITiles() {
  const teams = withAvg(mockTeams);

  // Totals
  const totalBins = teams.reduce((sum, t) => sum + t.bins, 0);
  const totalPickers = teams.reduce((sum, t) => sum + t.pickers, 0);
  const totalTarget = teams.reduce((sum, t) => sum + t.target, 0);
  const totalAvg = totalBins / totalPickers;

  const tiles = [
    {
      value: totalBins,
      label: "Total Bins Harvested",
      color: "text-success",
    },
    {
      value: totalPickers,
      label: "Active Pickers",
      color: "text-navy",
    },
    {
      value: `${((totalBins / totalTarget) * 100).toFixed(1)}%`,
      label: "Daily Target Progress",
      color: "text-primary",
    },
    {
      value: totalAvg.toFixed(1),
      label: "Avg / Picker",
      color: "text-danger",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-6">
      {tiles.map((t, idx) => (
        <div
          key={idx}
          className="bg-white rounded-md shadow-subtle p-card flex flex-col justify-between"
        >
          <div className={`text-2xl font-bold ${t.color}`}>{t.value}</div>
          <div className="text-sm text-navy/80">{t.label}</div>
        </div>
      ))}
    </div>
  );
}

export default KPITiles;
