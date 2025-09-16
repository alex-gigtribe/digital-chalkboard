// frontend/src/components/context/StatsContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { fetchDashboard, type DashboardData } from "@/api/dashboard";
import { useDepot } from "./DepotContext";

type DayStats = {
  bins: number;
  pickers: number;
  target: number;
  qcFlags: number;
  targetProgress: number; // calculated percentage
};

type DayComparison = {
  bins: { current: number; change: string; isPositive: boolean };
  pickers: { current: number; change: string; isPositive: boolean };
  targetProgress: { current: number; change: string; isPositive: boolean };
  qcFlags: { current: number; change: string; isPositive: boolean };
};

type StatsContextType = {
  currentStats: DayStats | null;
  previousStats: DayStats | null;
  comparison: DayComparison | null;
  teams: DashboardData["teams"] | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const { selectedDepot } = useDepot();
  const [currentStats, setCurrentStats] = useState<DayStats | null>(null);
  const [previousStats, setPreviousStats] = useState<DayStats | null>(null);
  const [teams, setTeams] = useState<DashboardData["teams"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Generate cache key with depot and date
  const getCacheKey = (date: string) => `dashboard_${selectedDepot?.id}_${date}`;
  
  const getTodayKey = () => getCacheKey(new Date().toISOString().split('T')[0]);
  const getYesterdayKey = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getCacheKey(yesterday.toISOString().split('T')[0]);
  };

  // Calculate day-over-day comparison
  const calculateComparison = (current: DayStats, previous: DayStats | null): DayComparison => {
    const binChange = previous ? current.bins - previous.bins : 0;
    const pickerChange = previous ? current.pickers - previous.pickers : 0;
    const targetChange = previous ? current.targetProgress - previous.targetProgress : 0;
    const qcChange = previous ? current.qcFlags - previous.qcFlags : 0;

    return {
      bins: {
        current: current.bins,
        change: previous ? `${binChange >= 0 ? '+' : ''}${((binChange / previous.bins) * 100).toFixed(1)}%` : "N/A",
        isPositive: binChange >= 0
      },
      pickers: {
        current: current.pickers,
        change: previous ? `${pickerChange >= 0 ? '+' : ''}${pickerChange}` : "N/A",
        isPositive: pickerChange >= 0
      },
      targetProgress: {
        current: current.targetProgress,
        change: previous ? `${targetChange >= 0 ? '+' : ''}${targetChange.toFixed(1)}%` : "N/A",
        isPositive: targetChange >= 0
      },
      qcFlags: {
        current: current.qcFlags,
        change: previous ? `${qcChange >= 0 ? '+' : ''}${qcChange}` : "N/A",
        isPositive: qcChange < 0 // For QC flags, fewer is better
      }
    };
  };

  // Process dashboard data into stats format
  const processStats = (data: DashboardData): DayStats => {
    const targetProgress = data.totals.target > 0 
      ? (data.totals.bins / data.totals.target) * 100 
      : 0;

    return {
      bins: data.totals.bins,
      pickers: data.totals.pickers,
      target: data.totals.target,
      qcFlags: data.totals.qcFlags,
      targetProgress
    };
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!selectedDepot) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDashboard(selectedDepot.id);
      const stats = processStats(data);
      
      // Store current day data
      setCurrentStats(stats);
      setTeams(data.teams);
      setLastUpdated(data.lastUpdated);
      
      // Cache current data
      localStorage.setItem(getTodayKey(), JSON.stringify(stats));
      
      // Load previous day data from cache
      const previousData = localStorage.getItem(getYesterdayKey());
      if (previousData) {
        setPreviousStats(JSON.parse(previousData));
      }
      
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Load data on depot change and set up polling
  useEffect(() => {
    if (!selectedDepot) return;

    loadDashboardData();

    // Poll every 30 seconds
    const interval = setInterval(loadDashboardData, 30_000);
    
    return () => clearInterval(interval);
  }, [selectedDepot]);

  // Calculate comparison when stats change
  const comparison = currentStats && previousStats 
    ? calculateComparison(currentStats, previousStats)
    : currentStats 
    ? calculateComparison(currentStats, null)
    : null;

  return (
    <StatsContext.Provider value={{
      currentStats,
      previousStats,
      comparison,
      teams,
      loading,
      error,
      lastUpdated
    }}>
      {children}
    </StatsContext.Provider>
  );
}

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) throw new Error("useStats must be used within a StatsProvider");
  return context;
};