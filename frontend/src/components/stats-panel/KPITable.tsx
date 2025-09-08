import { mockTeams, withAvg } from "../../data/mockTeams";

export function KPITable() {
  const teams = withAvg(mockTeams);

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
            {teams.map((team, idx) => {
              const above = team.bins >= team.target;
              return (
                <tr key={idx} className="even:bg-gray-50">
                  <td className="px-4 py-2">{today}</td>
                  <td className="px-4 py-2 font-medium text-navy">{team.name}</td>
                  <td className="px-4 py-2 text-right">{team.bins}</td>
                  <td className="px-4 py-2 text-right">{team.pickers}</td>
                  <td className="px-4 py-2 text-right">{team.avg?.toFixed(1)}</td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default KPITable;
