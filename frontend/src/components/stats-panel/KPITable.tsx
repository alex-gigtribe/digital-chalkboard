// frontend/src/components/stats-panel/KPITable.tsx
import { useEffect, useState } from "react";
import { fetchTeams, type Team } from "@/api/teams";
import { useDepot } from "../context/DepotContext";

export function KPITable() {
  const { selectedDepot } = useDepot();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedDepot) return;

    let isMounted = true;

    const loadTeams = async () => {
      try {
        setLoading(true);
        const data = await fetchTeams(selectedDepot.id, selectedDepot.name);
        if (isMounted) setTeams(data);
      } catch (e) {
        console.warn("Failed to load teams:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTeams();

    // ✅ Poll every 30 seconds
    const interval = setInterval(loadTeams, 30_000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedDepot]);

  // Compute totals even if empty (shell rows still render)
  const totals = teams.reduce(
    (acc, t) => {
      acc.bins += t.bins;
      acc.pickers += t.pickers;
      acc.target += t.target;
      return acc;
    },
    { bins: 0, pickers: 0, target: 0 }
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-md shadow-subtle overflow-hidden">
      <div className="px-4 py-3 border-b text-sm font-semibold text-navy">
        Team Performance
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Team</th>
              <th className="px-4 py-2 text-right">Bins (Collected)</th>
              <th className="px-4 py-2 text-right">Pickers</th>
              <th className="px-4 py-2 text-right">Avg / Picker</th>
              <th className="px-4 py-2 text-right">Bins (Target)</th>
              <th className="px-4 py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && teams.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse even:bg-gray-50">
                    <td className="px-4 py-2 text-gray-300">--</td>
                    <td className="px-4 py-2 text-gray-300">Loading...</td>
                    <td className="px-4 py-2 text-right text-gray-300">--</td>
                    <td className="px-4 py-2 text-right text-gray-300">--</td>
                    <td className="px-4 py-2 text-right text-gray-300">--</td>
                    <td className="px-4 py-2 text-right text-gray-300">--</td>
                    <td className="px-4 py-2 text-right text-gray-300">--</td>
                  </tr>
                ))
              : teams.map((team, idx) => {
                  const above = team.bins >= team.target;
                  return (
                    <tr key={idx} className="even:bg-gray-50">
                      <td className="px-4 py-2">{today}</td>
                      <td className="px-4 py-2 font-medium text-navy">
                        {team.name}
                      </td>
                      <td className="px-4 py-2 text-right">{team.bins}</td>
                      <td className="px-4 py-2 text-right">{team.pickers}</td>
                      <td className="px-4 py-2 text-right">
                        {team.avg?.toFixed(1)}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold text-success">
                        {team.target}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {above ? (
                          <span className="px-2 py-1 rounded-md bg-success/20 text-success text-xs font-medium">
                            Above Target
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-md bg-danger/20 text-danger text-xs font-medium">
                            Below Target
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

            <tr className="font-semibold bg-gray-100">
              <td className="px-4 py-2">{today}</td>
              <td className="px-4 py-2">TOTAL</td>
              <td className="px-4 py-2 text-right">{totals.bins}</td>
              <td className="px-4 py-2 text-right">{totals.pickers}</td>
              <td className="px-4 py-2 text-right">
                {totals.pickers ? (totals.bins / totals.pickers).toFixed(1) : "--"}
              </td>
              <td className="px-4 py-2 text-right">{totals.target}</td>
              <td className="px-4 py-2 text-right">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default KPITable;
