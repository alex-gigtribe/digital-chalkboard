// frontend/src/api/targets.ts
// Target data from BinScanIn table

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type TargetData = {
  totalTarget: number;      // SUM(Target) from BinScanIn for today
  progress: number;         // (actual bins / total target) * 100
  teamTargets: TeamTarget[]; // Targets by team
};

export type TeamTarget = {
  teamId: string;           // FarmTeamID
  teamName: string;         // Team name
  target: number;           // SUM(Target) for this team
  actual: number;           // COUNT(*) bins for this team
  progress: number;         // (actual / target) * 100
};

export async function fetchTargets(depotId: string): Promise<TargetData> {
  try {
    const response = await axiosClient.get<TargetData>(
      `${API_ENDPOINTS.targets}?zoneId=${depotId}`
    );

    if (import.meta.env.DEV) {
      console.log("[DEBUG] Targets data:", response.data);
    }

    return response.data;

  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error("[ERROR] Targets fetch failed:", {
        depotId,
        message: error.message,
        status: error.response?.status,
      });
    }

    throw error;
  }
}