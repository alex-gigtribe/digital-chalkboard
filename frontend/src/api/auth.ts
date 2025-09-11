// frontend/src/api/auth.ts
import axios from "axios";

export type LoginResponse = {
  token: string;
  securityGroupId: string;
  depots: string[];
};

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  // Step 1: Get the login page to retrieve __RequestVerificationToken
  const loginPage = await axios.get("/Account/Login", { withCredentials: true });
  const tokenMatch = loginPage.data.match(/name="__RequestVerificationToken" type="hidden" value="([^"]+)"/);
  
  if (!tokenMatch) {
    throw new Error("Could not find __RequestVerificationToken on login page");
  }

  const token = tokenMatch[1];

  // Step 2: Send login POST as form data
  const params = new URLSearchParams();
  params.append("__RequestVerificationToken", token);
  params.append("Email", username);
  params.append("Password", password);

  const response = await axios.post("/Account/Login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    withCredentials: true, // send cookies for session
  });

  if (response.status !== 200) {
    throw new Error("Login failed");
  }

  return {
    token: "cookie-session", // we don't actually get JWT here, but we track that we're logged in
    securityGroupId: "N/A",
    depots: [],
  };
}
