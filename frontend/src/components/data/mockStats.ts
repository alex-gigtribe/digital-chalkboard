// src/data/mockStats.ts
import { getTeamsForDepot, Team } from "../../components/data/mockTeams";

export interface Stats {
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
}

// ✅ Generate cache key per depot + date
function todayKey(depot: string) {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return `mockStats_${depot}_${date}`;
}

export function mockStats(depot: string): Stats {
  const key = todayKey(depot);

  // ✅ 1. Check cache first
  const cached = localStorage.getItem(key);
  if (cached) {
    return JSON.parse(cached) as Stats;
  }

  // ✅ 2. Generate fresh stats for today
  const teams: Team[] = getTeamsForDepot(depot);

  const totalBins = teams.reduce((s, t) => s + t.bins, 0);
  const totalPickers = teams.reduce((s, t) => s + t.pickers, 0);
  const totalTarget = teams.reduce((s, t) => s + t.target, 0);

  // QC flags → random but persisted for the day
  const qcFlags = Math.floor(Math.random() * 5);

  // ✅ Yesterday stats → also generated once per day
  const yesterdayBins = Math.floor(totalBins * (0.95 + Math.random() * 0.1));
  const yesterdayPickers = Math.max(
    1,
    totalPickers + (Math.random() > 0.5 ? 1 : -1)
  );
  const yesterdayQC = Math.max(0, Math.floor(Math.random() * 6));

  const stats: Stats = {
    today: {
      bins: totalBins,
      pickers: totalPickers,
      qcFlags,
      target: totalTarget,
    },
    yesterday: {
      bins: yesterdayBins,
      pickers: yesterdayPickers,
      qcFlags: yesterdayQC,
      target: totalTarget,
    },
  };

  // ✅ 3. Cache for the day
  try {
    localStorage.setItem(key, JSON.stringify(stats));
  } catch (e) {
    console.warn("Could not save stats to localStorage:", e);
  }

  return stats;
}

// ---------- Helpers ----------

export function getDelta(
  today: number,
  yesterday: number,
  isPercent = false
): string {
  const diff = today - yesterday;
  if (isPercent) {
    const pct = (diff / (yesterday || 1)) * 100;
    return `${diff >= 0 ? "+" : ""}${pct.toFixed(1)}% ${diff >= 0 ? "↑" : "↓"}`;
  }
  return `${diff >= 0 ? "+" : ""}${diff.toFixed(0)} ${diff >= 0 ? "↑" : "↓"}`;
}

export function getKPIs(depot: string) {
  const stats = mockStats(depot);
  const t = stats.today;
  const y = stats.yesterday;

  const todayProgress = (t.bins / (t.target || 1)) * 100;
  const yesterdayProgress = (y.bins / (y.target || 1)) * 100;

  return {
    bins: {
      value: `${t.bins} bins`,
      label: "Total Bins Harvested",
      delta: getDelta(t.bins, y.bins, true),
      color: "text-success",
    },
    pickers: {
      value: `${t.pickers} pickers`,
      label: "Active Pickers",
      delta: getDelta(t.pickers, y.pickers, false),
      color: "text-navy",
    },
    progress: {
      value: `${todayProgress.toFixed(1)}%`,
      label: "Daily Target Progress",
      delta: getDelta(todayProgress, yesterdayProgress, true),
      color: "text-primary",
    },
    qcFlags: {
      value: `${t.qcFlags} flags`,
      label: "QC Flags",
      delta: getDelta(t.qcFlags, y.qcFlags, false),
      color: "text-danger",
    },
  };
}
