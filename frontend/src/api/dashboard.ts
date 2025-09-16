// frontend/src/api/dashboard.ts
// Main dashboard API - DEV VERSION with hardcoded sample data

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type DashboardData = {
  totals: {
    bins: number;           // COUNT(*) from BinScanIn for today
    pickers: number;        // COUNT(DISTINCT EmployeeTagID) for today
    target: number;         // SUM(Target) from BinScanIn for today
    qcFlags: number;        // COUNT(*) WHERE QC = 1 for today
  };
  teams: TeamData[];        // Raw team data
  lastUpdated: string;
};

export type TeamData = {
  id: string;               // FarmTeamID (GUID)
  name: string;             // Team identifier 
  bins: number;             // Raw count
  pickers: number;          // Raw count
  target: number;           // Raw sum
};

function generateMockData(depotName: string): DashboardData {
  const teams: TeamData[] = [
    { id: "team-a-id", name: "Team A", bins: 134, pickers: 5, target: 120 },
    { id: "team-b-id", name: "Team B", bins: 86, pickers: 3, target: 72 },
    { id: "team-c-id", name: "Team C", bins: 138, pickers: 5, target: 120 },
    { id: "team-d-id", name: "Team D", bins: 83, pickers: 3, target: 72 },
    { id: "team-e-id", name: "Team E", bins: 110, pickers: 5, target: 120 },
    { id: "team-f-id", name: "Team F", bins: 77, pickers: 3, target: 72 },
    { id: "team-g-id", name: "Team G", bins: 120, pickers: 5, target: 120 },
    { id: "team-h-id", name: "Team H", bins: 98, pickers: 4, target: 96 },
    { id: "team-i-id", name: "Team I", bins: 105, pickers: 4, target: 96 },
    { id: "team-j-id", name: "Team J", bins: 93, pickers: 4, target: 96 }
  ];

  // Add some variation based on depot
  const depotMultiplier = depotName.includes("1") ? 0.9 : 
                         depotName.includes("2") ? 1.1 :
                         depotName.includes("3") ? 1.0 :
                         depotName.includes("4") ? 1.05 :
                         depotName.includes("5") ? 0.95 : 1.2;

  const adjustedTeams = teams.map(team => ({
    ...team,
    bins: Math.floor(team.bins * depotMultiplier),
    target: Math.floor(team.target * depotMultiplier)
  }));

  const totals = adjustedTeams.reduce(
    (acc, team) => ({
      bins: acc.bins + team.bins,
      pickers: acc.pickers + team.pickers,
      target: acc.target + team.target,
      qcFlags: acc.qcFlags
    }),
    { bins: 0, pickers: 0, target: 0, qcFlags: Math.floor(Math.random() * 6) }
  );

  return {
    totals,
    teams: adjustedTeams,
    lastUpdated: new Date().toISOString()
  };
}

export async function fetchDashboard(depotId: string): Promise<DashboardData> {
  
  // DEV MODE - Generate mock data
  if (import.meta.env.DEV) {
    const depotName = `Depot ${depotId}`;
    const mockData = generateMockData(depotName);
    
    console.log("[DEBUG] Dashboard mock data for", depotName, ":", mockData);
    return new Promise(resolve => setTimeout(() => resolve(mockData), 400));
  }

  // PRODUCTION - Real API call
  try {
    const response = await axiosClient.get<DashboardData>(
      `${API_ENDPOINTS.dashboard}?zoneId=${depotId}`
    );

    console.log("[DEBUG] Dashboard raw data:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("[ERROR] Dashboard fetch failed:", {
      depotId,
      message: error.message,
      status: error.response?.status,
    });

    throw error;
  }
}