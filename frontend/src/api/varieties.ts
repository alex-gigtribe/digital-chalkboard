// frontend/src/api/varieties.ts  
// Varieties API - DEV VERSION with hardcoded variety data

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

function generateMockVarieties(): VarietiesData {
  const varieties: VarietyData[] = [
    { varietyId: "variety-1", varietyName: "Navel - Palmer", binCount: 312 },
    { varietyId: "variety-2", varietyName: "Navel - Washington", binCount: 289 },
    { varietyId: "variety-3", varietyName: "Mandarin - Queen", binCount: 156 },
    { varietyId: "variety-4", varietyName: "Navel - Cambria", binCount: 134 },
    { varietyId: "variety-5", varietyName: "Orange - Valencia", binCount: 98 }
  ];

  return {
    totalVarieties: varieties.length,
    varieties,
    lastUpdated: new Date().toISOString()
  };
}

export async function fetchVarieties(depotId: string): Promise<VarietiesData> {
  
  // DEV MODE - Generate mock varieties
  if (!import.meta.env.DEV) {
    const mockData = generateMockVarieties();
    console.log("[DEBUG] Varieties mock data:", mockData);
    return new Promise(resolve => setTimeout(() => resolve(mockData), 300));
  }

  // PRODUCTION - Real API call
  try {
    const response = await axiosClient.get<VarietiesData>(
      `${API_ENDPOINTS.varieties}?zoneId=${depotId}`
    );

    console.log("[DEBUG] Varieties raw data:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("[ERROR] Varieties fetch failed:", {
      depotId,
      message: error.message,
      status: error.response?.status,
    });

    throw error;
  }
}