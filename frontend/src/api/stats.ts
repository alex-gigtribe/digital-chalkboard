// src/api/stats.ts
export type KPIStats = {
  today: {
    bins: number;
    pickers: number;
    qcFlags: number;
    target: number;
  };
  yesterday: {
    bins: number;
    pickers: number;
    qcFlags: number;
    target: number;
  };
};

// ✅ Generate mock stats consistent with KPIStats type
function generateMockStats(): KPIStats {
  const pickersToday = 40;
  const targetToday = pickersToday * 24;
  const binsToday = Math.floor(targetToday * (0.9 + Math.random() * 0.2)); // 90–110%
  const qcFlagsToday = Math.floor(Math.random() * 5);

  const pickersYesterday = pickersToday + (Math.random() > 0.5 ? 1 : -1);
  const binsYesterday = Math.floor(targetToday * (0.85 + Math.random() * 0.15));
  const qcFlagsYesterday = Math.floor(Math.random() * 6);

  return {
    today: {
      bins: binsToday,
      pickers: pickersToday,
      qcFlags: qcFlagsToday,
      target: targetToday,
    },
    yesterday: {
      bins: binsYesterday,
      pickers: pickersYesterday,
      qcFlags: qcFlagsYesterday,
      target: targetToday,
    },
  };
}

/**
 * fetchStats
 * - Mock for now
 * - Caches in localStorage per depot
 * - Fires `online` / `offline` events for Header status
 */
export async function fetchStats(depotName?: string): Promise<KPIStats> {
  const key = `stats_${depotName ?? "unknown"}`;

  try {
    // --- REAL API (uncomment when ready) ---
    /*
    const response = await axiosClient.get(`/depots/${depotName}/stats`);
    const data = response.data as KPIStats;
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("online"));
    return data;
    */

    // --- MOCK ---
    const data = generateMockStats();
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("online"));
    return data;
  } catch (err) {
    console.error("Failed to fetch stats, using cache:", err);
    window.dispatchEvent(new Event("offline"));
    const cached = localStorage.getItem(key);
    return cached ? (JSON.parse(cached) as KPIStats) : generateMockStats();
  }
}
