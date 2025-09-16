// frontend/src/api/depots.ts
// Backend tables: [Zone], [ZoneFarm], [Farm] - DEV VERSION with hardcoded depots

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
  
  // DEV MODE - Hardcoded depots for testing
  if (import.meta.env.DEV) {
    const mockDepots: Depot[] = [
      {
        id: "depot-1-id",
        farmId: "farm-1-id", 
        farmName: "Hutton Squire Farm 1",
        name: "Hutton Squire 1",
        isActive: true
      },
      {
        id: "depot-2-id",
        farmId: "farm-2-id",
        farmName: "Hutton Squire Farm 2", 
        name: "Hutton Squire 2",
        isActive: true
      },
      {
        id: "depot-3-id",
        farmId: "farm-3-id",
        farmName: "Hutton Squire Farm 3",
        name: "Hutton Squire 3", 
        isActive: true
      },
      {
        id: "depot-4-id",
        farmId: "farm-4-id",
        farmName: "Hutton Squire Farm 4",
        name: "Hutton Squire 4",
        isActive: true
      },
      {
        id: "depot-5-id", 
        farmId: "farm-5-id",
        farmName: "Hutton Squire Farm 5",
        name: "Hutton Squire 5",
        isActive: true
      },
      {
        id: "depot-6-id",
        farmId: "farm-6-id", 
        farmName: "Hutton Squire Farm 6",
        name: "Hutton Squire 6",
        isActive: true
      }
    ];
    
    console.log("[DEBUG] Dev depots loaded:", mockDepots);
    return new Promise(resolve => setTimeout(() => resolve(mockDepots), 300));
  }

  // PRODUCTION - Real API call
  const response = await axiosClient.get<Depot[]>(API_ENDPOINTS.depots);
  console.log("[DEBUG] Depots fetched:", response.data);
  return response.data;
}