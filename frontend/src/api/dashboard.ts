// frontend/src/api/dashboard.ts
// Main dashboard API - fetches raw data only, no calculations
// Components will aggregate and calculate on frontend

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

export async function fetchDashboard(depotId: string): Promise<DashboardData> {
  try {
    const response = await axiosClient.get<DashboardData>(
      `${API_ENDPOINTS.dashboard}?zoneId=${depotId}`
    );

    if (import.meta.env.DEV) {
      console.log("[DEBUG] Dashboard raw data:", response.data);
    }

    return response.data;

  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error("[ERROR] Dashboard fetch failed:", {
        depotId,
        message: error.message,
        status: error.response?.status,
      });
    }

    throw error;
  }
}