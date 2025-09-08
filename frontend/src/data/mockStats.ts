import { mockTeams, withAvg, Team } from "./mockTeams";

export interface Stats {
  today: { bins: number; pickers: number; qcFlags: number; target: number };
  yesterday: { bins: number; pickers: number; qcFlags: number; target: number };
}

function todayKey(depot: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `mockStats_${depot}_${date}`;
}

export function mockStats(depot: string): Stats {
  const key = todayKey(depot);

  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached) as Stats;

  const todayTeams: Team[] = withAvg(mockTeams(depot));
  const totalBins = todayTeams.reduce((s, t) => s + t.bins, 0);
  const totalPickers = todayTeams.reduce((s, t) => s + t.pickers, 0);
  const totalTarget = todayTeams.reduce((s, t) => s + t.target, 0);
  const qcFlags = Math.floor(Math.random() * 5);

  const yesterdayBins = Math.floor(totalBins * (0.95 + Math.random() * 0.1));
  const yesterdayPickers = Math.max(1, totalPickers + (Math.random() > 0.5 ? 1 : -1));
  const yesterdayQC = Math.max(0, Math.floor(Math.random() * 6));

  const stats: Stats = {
    today: { bins: totalBins, pickers: totalPickers, qcFlags, target: totalTarget },
    yesterday: { bins: yesterdayBins, pickers: yesterdayPickers, qcFlags: yesterdayQC, target: totalTarget },
  };

  localStorage.setItem(key, JSON.stringify(stats));
  return stats;
}

export function getDelta(today: number, yesterday: number, isPercent = false): string {
  const diff = today - yesterday;
  if (isPercent) {
    const pct = (diff / yesterday) * 100;
    return `${diff >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
  }
  return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}`;
}

export function getKPIs(depot: string) {
  const stats = mockStats(depot);
  const t = stats.today;
  const y = stats.yesterday;

  const todayProgress = ((t.bins / t.target) * 100).toFixed(1);
  const yesterdayProgress = ((y.bins / y.target) * 100).toFixed(1);

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
      delta: getDelta(t.pickers, y.pickers),
      color: "text-navy",
    },
    progress: {
      value: `${todayProgress}%`,
      label: "Daily Target Progress",
      delta: getDelta(Number(todayProgress), Number(yesterdayProgress)),
      color: "text-primary",
    },
    qcFlags: {
      value: `${t.qcFlags} flags`,
      label: "QC Flags",
      delta: getDelta(t.qcFlags, y.qcFlags),
      color: "text-danger",
    },
  };
}
