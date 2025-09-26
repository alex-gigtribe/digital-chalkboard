// frontend/src/api/depots.ts
// Backend tables: [Zone], [ZoneFarm], [Farm] - DEV VERSION with hardcoded depots || production 

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type Depot = {
  id: string;       // Zone.ID
  farmId: string;   // Farm.ID
  farmName: string; // Farm.Name
  name: string;     // Zone.Name
  isActive: boolean;
};

export async function fetchDepots(): Promise<Depot[]> {
  
  // Check if using mock login (admin user)
  const authToken = localStorage.getItem("authToken");
  if (authToken === "mock-jwt-token-12345") {
    // Return mock depots for admin user
    const mockDepots: Depot[] = [
      { id: "depot-1-id", farmId: "farm-1-id", farmName: "Hutton Squire Farm 1", name: "Depot 1", isActive: true },
      { id: "depot-2-id", farmId: "farm-2-id", farmName: "Hutton Squire Farm 2", name: "Depot 2", isActive: true },
      { id: "depot-3-id", farmId: "farm-3-id", farmName: "Hutton Squire Farm 3", name: "Depot 3", isActive: true },
      { id: "depot-4-id", farmId: "farm-4-id", farmName: "Hutton Squire Farm 4", name: "Depot 4", isActive: true },
      { id: "depot-5-id", farmId: "farm-5-id", farmName: "Hutton Squire Farm 5", name: "Depot 5", isActive: true },
      { id: "depot-6-id", farmId: "farm-6-id", farmName: "Hutton Squire Farm 6", name: "Depot 6", isActive: true }
    ];
    return new Promise(resolve => setTimeout(() => resolve(mockDepots), 300));
  }

  // For real users, try real API
  try {
    const response = await axiosClient.get<Depot[]>(API_ENDPOINTS.depots);
    return response.data;
  } catch (error: any) {
    console.error("[ERROR] Depots fetch failed:", error);
    throw error;
  }
}
