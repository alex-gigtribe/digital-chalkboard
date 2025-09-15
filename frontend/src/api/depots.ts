// frontend/src/api/depots.ts
// Backend tables: [Zone], [ZoneFarm], [Farm]

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
  const response = await axiosClient.get<Depot[]>(API_ENDPOINTS.depots);

  //  Dev log - only in non-production
  if (import.meta.env.DEV) {
    console.log("[DEBUG] Depots fetched:", response.data);
  }

  return response.data;
}
