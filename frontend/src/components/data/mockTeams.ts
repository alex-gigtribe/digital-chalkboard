// src/data/mockTeams.ts
// Single source for generated teams per depot/day. Persisted to localStorage
export interface Team {
  name: string;
  bins: number;
  pickers: number;
  target: number;
  avg?: number;
}

function todayKey(depot: string) {
  const date = new Date().toISOString().split("T")[0];
  return `teams_${depot}_${date}`;
}

/**
 * Ensure exactly two teams are below target:
 * - We initially generate with some chance of being below/above target.
 * - Then enforce exactly 2 below target by adjusting bins upward for randomly chosen teams if needed.
 */
function enforceTwoBelowTarget(teams: Team[]) {
  // Find indices that are below
  const belowIndices: number[] = teams
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.bins < t.target)
    .map(({ i }) => i);

  if (belowIndices.length === 2) return teams;

  if (belowIndices.length > 2) {
    // Move some above by increasing bins to target
    const extra = belowIndices.length - 2;
    // Sort by how far below they are (biggest deficit first) to raise the smallest first
    const sorted = [...belowIndices].sort((a, b) => (teams[a].target - teams[a].bins) - (teams[b].target - teams[b].bins));
    for (let i = 0; i < extra; i++) {
      const idx = sorted[i];
      teams[idx].bins = teams[idx].target; // bump to target (now counts as at/above)
    }
    return teams;
  }

  if (belowIndices.length < 2) {
    // Need to make up some below-target teams
    const need = 2 - belowIndices.length;
    // Choose candidates currently at/above target, reduce them to below
    const candidates = teams
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.bins >= t.target)
      .map(({ i }) => i);

    // Shuffle candidates
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    for (let k = 0; k < need && k < candidates.length; k++) {
      const idx = candidates[k];
      // Reduce bins to 80-89% of target
      teams[idx].bins = Math.max(0, Math.floor(teams[idx].target * (0.8 + Math.random() * 0.1)));
    }
  }

  return teams;
}

/**
 * Returns teams for depot/day (cached).
 */
export function getTeamsForDepot(depot: string = "Hutton Squire 1"): Team[] {
  const key = todayKey(depot);
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached) as Team[];
    }
  } catch (e) {
    // ignore
  }

  // generate 10 teams
  const teams: Team[] = Array.from({ length: 10 }).map((_, idx) => {
    const pickers = Math.floor(Math.random() * 3) + 3; // 3..5
    const target = pickers * 24;
    // bins generally 90% - 120% of target
    const bins = Math.floor(target * (0.9 + Math.random() * 0.3));
    return {
      name: `Team ${String.fromCharCode(65 + idx)}`,
      bins,
      pickers,
      target,
    };
  });

  // Force exactly 2 below target
  const fixed = enforceTwoBelowTarget(teams);

  // add avg
  const withAvg = fixed.map((t) => ({ ...t, avg: t.pickers ? t.bins / t.pickers : 0 }));

  try {
    localStorage.setItem(key, JSON.stringify(withAvg));
  } catch (e) {
    // ignore
  }

  return withAvg;
}
