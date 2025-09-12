// frontend/src/api/auth.ts
// Mock + placeholder for real login endpoint.
//
// Usage:
//   const res = await loginUser(email, password);
//   // res: { token, securityGroupId, depots }

export type Depot = {
  id: number;
  name: string;
  zoneName: string;
};

export type LoginResponse = {
  token: string;
  securityGroupId: string;
  depots: Depot[];
  username?: string;
};

const MOCK_DEPOTS: Depot[] = [
  { id: 1, name: "Hutton Squire 1", zoneName: "Zone A" },
  { id: 2, name: "Hutton Squire 2", zoneName: "Zone A" },
  { id: 3, name: "Hutton Squire 3", zoneName: "Zone B" },
  { id: 4, name: "Hutton Squire 4", zoneName: "Zone B" },
  { id: 5, name: "Hutton Squire 5", zoneName: "Zone C" },
  { id: 6, name: "Hutton Squire 6", zoneName: "Zone C" },
];

function sleep(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * loginUser
 * - Mocked for now.
 * - To enable production: uncomment the axios block and replace endpoint URL.
 */
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  // tiny network delay to make UI transitions visible
  await sleep(300);

  // Basic validation (mock)
  const allowed = [
    "digi@email.com",
    "jd@email.com",
    "admin@email.com",
    "justin@email.com",
  ];

  // Accept only the allowed usernames and the Admin123 password for demo
  const validUser = allowed.includes(username.toLowerCase());
  const validPass = password === "Admin123";

  if (!validUser || !validPass) {
    // Simulate network auth error
    throw new Error("Invalid username or password (demo credentials).");
  }

  // Build response
  const securityGroupId = username.toLowerCase().includes("admin") ? "ADMIN" : "DIGI";
  const token = "mock-token-123"; // demo token; replace with real JWT once prod available

  // For the demo, return the full depot list (no duplicates)
  return {
    token,
    securityGroupId,
    depots: MOCK_DEPOTS,
    username,
  };

  // ---------------------------
  // Production example (uncomment & adapt)
  // ---------------------------
  /*
  import axios from "axios";
  const response = await axios.post("https://portal.adagintech.com/api/account/login", { username, password }, { withCredentials: true });
  // expect response.data = { token, securityGroupId, depots: [...] }
  return response.data as LoginResponse;
  */
}
