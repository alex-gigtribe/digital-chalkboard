// frontend/src/api/activities.ts
// Activity data from BinScanIn table (via FarmTeamTagID -> FarmActivity)

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type ActivityData = {
  totalActivities: number;    // Total activity records for today
  activities: Activity[];     // Activities by type
};

export type Activity = {
  activityId: string;         // FarmActivity.ID
  activityName: string;       // FarmActivity.Name (e.g., "Pickers", "Packers")
  teamCount: number;          // Number of teams doing this activity
  employeeCount: number;      // Total employees in this activity
  binCount: number;           // Total bins for this activity
};

export async function fetchActivities(depotId: string): Promise<ActivityData> {
  try {
    const response = await axiosClient.get<ActivityData>(
      `${API_ENDPOINTS.activities}?zoneId=${depotId}`
    );

    if (import.meta.env.DEV) {
      console.log("[DEBUG] Activities data:", response.data);
    }

    return response.data;

  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error("[ERROR] Activities fetch failed:", {
        depotId,
        message: error.message,
        status: error.response?.status,
      });
    }

    throw error;
  }
}