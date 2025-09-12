// frontend/src/api/teams.ts
// import axiosClient from "./axiosClient";

export type Team = {
  name: string;
  bins: number;
  pickers: number;
  target: number;
  avg?: number;
};

function cacheKey(depot: string | number) {
  const date = new Date().toISOString().split("T")[0];
  return `teams_${depot}_${date}`;
}

// 🔧 Mock generator: 10 teams, exactly 2 below target
function generateMockTeams(_depotName: string): Team[] {
  const teams: Team[] = Array.from({ length: 10 }).map((_, idx) => {
    const pickers = Math.floor(Math.random() * 3) + 3; // 3–5 pickers
    const target = pickers * 24;
    const bins = Math.floor(target * (0.9 + Math.random() * 0.3)); // 90–120% of target
    return {
      name: `Team ${String.fromCharCode(65 + idx)}`,
      bins,
      pickers,
      target,
    };
  });

  // Ensure exactly 2 teams below target
  const belowIndices = teams.map((t, i) => (t.bins < t.target ? i : -1)).filter((i) => i >= 0);
  if (belowIndices.length < 2) {
    // lower random teams
    const candidates = teams.map((_, i) => i).filter((i) => !belowIndices.includes(i));
    for (let i = belowIndices.length; i < 2 && candidates.length; i++) {
      const idx = candidates.pop()!;
      teams[idx].bins = Math.floor(teams[idx].target * 0.85);
    }
  } else if (belowIndices.length > 2) {
    // raise some to target
    const extras = belowIndices.slice(2);
    extras.forEach((i) => (teams[i].bins = teams[i].target));
  }

  return teams.map((t) => ({
    ...t,
    avg: t.pickers > 0 ? t.bins / t.pickers : 0,
  }));
}

/**
 * fetchTeams
 * Fetches teams for a depot (mock or real).
 * 
 * Production endpoint (when available):
 *   GET https://portal.adagintech.com/api/depots/{depotId}/teams
 */
export async function fetchTeams(depotId?: number, depotName?: string): Promise<Team[]> {
  const key = cacheKey(depotId ?? depotName ?? "unknown");

  try {
    // --- REAL API (PRODUCTION) ---
    /*
    const id = depotId ?? 0;
    const response = await axiosClient.get(`/depots/${id}/teams`);
    const data = response.data as Team[];
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("online"));
    return data;
    */

    // --- MOCK API (DEMO) ---
    const name = depotName ?? `Depot ${depotId ?? 1}`;
    const data = generateMockTeams(name);
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("online"));
    return data;
  } catch (err) {
    console.error("Failed to fetch teams, using cache if available:", err);
    window.dispatchEvent(new Event("offline"));
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached) as Team[];
    return []; // fallback to empty shell
  }
}
