// frontend/src/api/stats.ts
// import axiosClient from "./axiosClient";

export type Stats = {
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

// ✅ Add KPIStats type
export type KPIStats = {
  bins: { value: string; label: string; delta: string; color: string };
  pickers: { value: string; label: string; delta: string; color: string };
  progress: { value: string; label: string; delta: string; color: string };
  qcFlags: { value: string; label: string; delta: string; color: string };
};

function cacheKey(depot: string | number) {
  const date = new Date().toISOString().split("T")[0];
  return `stats_${depot}_${date}`;
}

function generateMockStats(): Stats {
  const todayBins = Math.floor(Math.random() * 250) + 200;
  const pickers = Math.floor(Math.random() * 10) + 5;
  const target = 250;
  const qcFlags = Math.floor(Math.random() * 6);

  const yesterdayBins = Math.floor(todayBins * (0.9 + Math.random() * 0.2));
  const yesterdayPickers = Math.max(1, pickers + (Math.random() > 0.5 ? 1 : -1));
  const yesterdayQC = Math.floor(Math.random() * 6);

  return {
    today: { bins: todayBins, pickers, qcFlags, target },
    yesterday: { bins: yesterdayBins, pickers: yesterdayPickers, qcFlags: yesterdayQC, target },
  };
}

// ✅ Convert Stats → KPIStats for UI
export function transformToKPI(stats: Stats): KPIStats {
  const t = stats.today;
  const y = stats.yesterday;

  const getDelta = (today: number, yesterday: number, percent = false) => {
    const diff = today - yesterday;
    if (percent) {
      const pct = (diff / (yesterday || 1)) * 100;
      return `${diff >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
    }
    return `${diff >= 0 ? "+" : ""}${diff}`;
  };

  const todayProgress = (t.bins / (t.target || 1)) * 100;
  const yesterdayProgress = (y.bins / (y.target || 1)) * 100;

  return {
    bins: {
      value: `${t.bins} bins`,
      label: "Total Bins Harvested",
      delta: getDelta(t.bins, y.bins, true),
      color: t.bins >= t.target ? "text-success" : "text-danger",
    },
    pickers: {
      value: `${t.pickers}`,
      label: "Active Pickers",
      delta: getDelta(t.pickers, y.pickers),
      color: "text-navy",
    },
    progress: {
      value: `${todayProgress.toFixed(1)}%`,
      label: "Daily Target Progress",
      delta: getDelta(todayProgress, yesterdayProgress, true),
      color: todayProgress >= 100 ? "text-success" : "text-primary",
    },
    qcFlags: {
      value: `${t.qcFlags}`,
      label: "QC Flags",
      delta: getDelta(t.qcFlags, y.qcFlags),
      color: t.qcFlags > y.qcFlags ? "text-danger" : "text-success",
    },
  };
}

/**
 * fetchStats
 * Fetches KPI stats for a depot (mock or real).
 */
export async function fetchStats(depot: string | number): Promise<Stats> {
  const key = cacheKey(depot);

  try {
    /*
    const response = await axiosClient.get(`/depots/${depot}/stats`);
    const data = response.data as Stats;
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("online"));
    return data;
    */

    const data = generateMockStats();
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("online"));
    return data;
  } catch (err) {
    console.error("Failed to fetch stats, using cache if available:", err);
    window.dispatchEvent(new Event("offline"));
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached) as Stats;
    return generateMockStats();
  }
}
