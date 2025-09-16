// frontend/src/components/context/StatsContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { fetchDashboard, type DashboardData } from "@/api/dashboard";
import { useDepot } from "./DepotContext";

const BINS_PER_PERSON_TARGET = 24; // Constant: 24 bins per person

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
  isOnline: boolean;
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
  const [isOnline, setIsOnline] = useState(true);

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

  // Process dashboard data with proper target calculation
  const processStats = (data: DashboardData): DayStats => {
    // Calculate proper targets: each team's pickers * 24 bins per person
    const teamsWithTargets = data.teams.map(team => ({
      ...team,
      target: team.pickers * BINS_PER_PERSON_TARGET
    }));

    const totalTarget = teamsWithTargets.reduce((sum, team) => sum + team.target, 0);
    const targetProgress = totalTarget > 0 ? (data.totals.bins / totalTarget) * 100 : 0;

    return {
      bins: data.totals.bins,
      pickers: data.totals.pickers,
      target: totalTarget,
      qcFlags: data.totals.qcFlags,
      targetProgress
    };
  };

  // Load dashboard data with error handling
  const loadDashboardData = async () => {
    if (!selectedDepot) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDashboard(selectedDepot.id);
      const stats = processStats(data);
      
      // Update teams with correct targets
      const teamsWithTargets = data.teams.map(team => ({
        ...team,
        target: team.pickers * BINS_PER_PERSON_TARGET
      }));
      
      setCurrentStats(stats);
      setTeams(teamsWithTargets);
      setLastUpdated(data.lastUpdated);
      setIsOnline(true);
      
      // Fire online event for header
      window.dispatchEvent(new Event("online"));
      
      // Cache current data
      localStorage.setItem(getTodayKey(), JSON.stringify(stats));
      localStorage.setItem(`teams_${selectedDepot.id}`, JSON.stringify(teamsWithTargets));
      
      // Load previous day data from cache
      const previousData = localStorage.getItem(getYesterdayKey());
      if (previousData) {
        setPreviousStats(JSON.parse(previousData));
      }
      
    } catch (err: any) {
      console.error("API failed, loading cached data:", err);
      setError("API offline - showing cached data");
      setIsOnline(false);
      
      // Fire offline event for header
      window.dispatchEvent(new Event("offline"));
      
      // Load cached data if available
      const cachedStats = localStorage.getItem(getTodayKey());
      const cachedTeams = localStorage.getItem(`teams_${selectedDepot.id}`);
      
      if (cachedStats) {
        setCurrentStats(JSON.parse(cachedStats));
      }
      if (cachedTeams) {
        setTeams(JSON.parse(cachedTeams));
      }
      
      const previousData = localStorage.getItem(getYesterdayKey());
      if (previousData) {
        setPreviousStats(JSON.parse(previousData));
      }
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
      lastUpdated,
      isOnline
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