
// endpoints/requestedEndpoints.ts
export const API_ENDPOINTS = {
  // Authentication
  login: "/application/authenticate",              // POST - Security.SecurityGroup, Security.Session
  
  // Depot Management  
  depots: "/api/zones/depots",              // GET - AdaginTech.Zone, AdaginTech.Farm
  
  // Main Dashboard
  dashboard: "/api/dashboard/summary",      // GET - AdaginTech.BinScanIn, AdaginTech.FarmTeam
  
  // Optional Details
  qcDetails: "/api/qc/details",            // GET - AdaginTech.BinScanIn, AdaginTech.FarmOtherIssue, AdaginTech.FarmPestIssue
  
  varieties: "/api/varieties/summary",     // GET - AdaginTech.BinScanIn, AdaginTech.FarmAreaVariety
};