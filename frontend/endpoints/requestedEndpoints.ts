// endpoints/requestedEndpoints.ts
// Centralized API endpoints for AdaginTech integration
// Change only here when switching environments (QA → Production)

export const API_ENDPOINTS = {
  login: "/account/login",           // POST - body: { username, password }
  depots: "/zones?filter=depot",     // GET - filters zones where Name LIKE '%Depot%'
  employees: "/employees",           // GET - fetches employee list by depot/team
  qc: "/qc",                         // GET - quality control records
  stats: "/stats",                   // GET - daily stats (bins, targets, qc, etc.)
};
