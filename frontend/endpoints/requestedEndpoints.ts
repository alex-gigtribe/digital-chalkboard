/**
 * LIVE API INTEGRATION (Phase 2)
 *
 * - Replace mock data in /src/api/*.ts with real axios calls (commented-out examples are already in place).
 * - All dashboard polling (stats + teams) runs every 3000ms by default.
 * - Last successful data is cached in localStorage and displayed when offline.
 * - When API fails, header & wifi icon turn red (offline indicator).
 * - Authentication and depot access control must be enforced by backend (not frontend).
 *
 * Required production endpoints:
 *
 * 1) POST /api/auth/login
 *    -> Body: { username, password }
 *    <- Returns: { token, username, securityGroupId, depots: [...] }
 *
 * 2) GET /api/depots
 *    <- Returns: [{ id, name, zoneName }]
 *
 * 3) GET /api/depots/{depotId}/teams
 *    <- Returns: [{ name, bins, pickers, target, avg }]
 *
 * 4) GET /api/depots/{depotId}/stats
 *    <- Returns: { today: { bins, pickers, qcFlags, target }, yesterday: {...} }
 *
 * 5) (Optional future)
 *    - GET /api/depots/{depotId}/bins
 *    - GET /api/depots/{depotId}/employees
 *    - GET /api/depots/{depotId}/qc
 *
 * After backend is ready:
 * - Uncomment axios calls in /src/api/auth.ts, depots.ts, teams.ts, stats.ts
 * - Point axiosClient baseURL to production URL in .env (VITE_API_BASE_URL)
 * - Test login → depot → dashboard flow online with real data
 */


/**
 * SECURITY NOTES:
 * - Never hardcode tokens, secrets, or credentials in the frontend.
 * - Store auth token only in memory + localStorage for session restore.
 * - All authorization + data access must be validated server-side.
 * - .env files (VITE_API_BASE_URL, etc.) only hold non-secret config (URLs).
 * - Sensitive keys (DB credentials, signing keys) stay on backend only.
 */
