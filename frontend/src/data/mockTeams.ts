export interface Team {
  name: string;
  bins: number;
  pickers: number;
  target: number;
  avg?: number;
}

export function mockTeams(_depot: string = "Hutton Squire 1"): Team[] {
  return Array.from({ length: 10 }).map((_, idx) => {
    const pickers = Math.floor(Math.random() * 3) + 3; // 3–5 pickers
    const target = pickers * 24;
    let bins = Math.floor(target * (0.9 + Math.random() * 0.3)); // 90–120%

    // Force exactly 2 teams below target
    if (idx < 2) bins = Math.floor(target * (0.8 + Math.random() * 0.1));

    return {
      name: `Team ${String.fromCharCode(65 + idx)}`, 
      bins,
      pickers,
      target,
    };
  });
}

export function withAvg(teams: Team[]): Team[] {
  return teams.map((t) => ({ ...t, avg: t.bins / t.pickers }));
}
