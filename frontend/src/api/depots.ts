// frontend/src/api/depots.ts
// Single source for depots (mock + production placeholder)

export type Depot = {
  id: number;
  name: string;
  zoneName: string;
};

const CACHE_KEY = "depots_cache_v1";

/**
 * fetchDepots
 * - Mock currently returns static list.
 * - Production: uncomment the axiosClient block and replace the endpoint.
 */
export async function fetchDepots(): Promise<Depot[]> {
  // ---------------------------
  // Production (uncomment when ready)
  // ---------------------------
  /*
  import axiosClient from "./axiosClient";
  const res = await axiosClient.get("/api/depots"); // e.g. https://portal.adagintech.com/api/depots
  localStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
  window.dispatchEvent(new Event("online"));
  return res.data as Depot[];
  */

  try {
    // MOCK data (kept inside this API file)
    const mock: Depot[] = [
      { id: 1, name: "Hutton Squire 1", zoneName: "Zone A" },
      { id: 2, name: "Hutton Squire 2", zoneName: "Zone A" },
      { id: 3, name: "Hutton Squire 3", zoneName: "Zone B" },
      { id: 4, name: "Hutton Squire 4", zoneName: "Zone B" },
      { id: 5, name: "Hutton Squire 5", zoneName: "Zone C" },
      { id: 6, name: "Hutton Squire 6", zoneName: "Zone C" },
    ];

    // save cache for offline use
    localStorage.setItem(CACHE_KEY, JSON.stringify(mock));
    // notify app-level online
    window.dispatchEvent(new Event("online"));
    return mock;
  } catch (err) {
    console.warn("fetchDepots mock failed, trying cache:", err);
    window.dispatchEvent(new Event("offline"));
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached) as Depot[];
    // very last-resort: return empty array
    return [];
  }
}
