// frontend/src/api/varieties.ts  
// Varieties API - fetches raw variety data only, no calculations

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type VarietiesData = {
  totalVarieties: number;   // Raw count
  varieties: VarietyData[];
  lastUpdated: string;
};

export type VarietyData = {
  varietyId: string;        // Raw ID
  varietyName: string;      // Name from lookup
  binCount: number;         // Raw count only
};

export async function fetchVarieties(depotId: string): Promise<VarietiesData> {
  try {
    const response = await axiosClient.get<VarietiesData>(
      `${API_ENDPOINTS.varieties}?zoneId=${depotId}`
    );

    if (import.meta.env.DEV) {
      console.log("[DEBUG] Varieties raw data:", response.data);
    }

    return response.data;

  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error("[ERROR] Varieties fetch failed:", {
        depotId,
        message: error.message,
        status: error.response?.status,
      });
    }

    throw error;
  }
}