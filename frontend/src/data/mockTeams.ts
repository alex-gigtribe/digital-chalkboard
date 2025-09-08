export interface Team {
  name: string;
  bins: number;
  pickers: number;
  target: number;
  avg?: number;
}

export const mockTeams: Team[] = [
  { name: "Team A", bins: 122, pickers: 5, target: 5 * 24 },
  { name: "Team B", bins: 97, pickers: 4, target: 4 * 24 },
  { name: "Team C", bins: 110, pickers: 5, target: 5 * 24 },
  { name: "Team D", bins: 68, pickers: 3, target: 3 * 24 },
  { name: "Team E", bins: 142, pickers: 6, target: 6 * 24 },
  { name: "Team F", bins: 82, pickers: 4, target: 4 * 24 },
  { name: "Team G", bins: 76, pickers: 3, target: 3 * 24 },
  { name: "Team H", bins: 133, pickers: 6, target: 6 * 24 },
  { name: "Team I", bins: 92, pickers: 4, target: 4 * 24 },
  { name: "Team J", bins: 117, pickers: 5, target: 5 * 24 },
];

// Utility: add averages
export function withAvg(teams: Team[]): Team[] {
  return teams.map((t) => ({
    ...t,
    avg: t.bins / t.pickers,
  }));
}
