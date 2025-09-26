// frontend/src/api/auth.ts
// Login API with admin/admin mock & prod for testing in all environments

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type LoginResponse = {
  token: string;            // JWT / session token
  securityGroupId: string;  // [AdaginSecurityGroup].[ID] (GUID)
  username?: string;        // Optional display name
};

// const BINS_PER_PERSON_TARGET = 24; // Constant: 24 bins per person

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  
  // Allow admin/admin for testing in ALL environments (dev and production)
  if (username === "admin" && password === "admin") {
    const mockResponse: LoginResponse = {
      token: "mock-jwt-token-12345",
      securityGroupId: "dev-security-group-id",
      username: "Admin User (Demo)"
    };
    
    console.log("[DEBUG] Mock login successful:", mockResponse);
    return new Promise(resolve => setTimeout(() => resolve(mockResponse), 500));
  }

  // For all other credentials, try real API
  try {
    const response = await axiosClient.post<LoginResponse>(
      API_ENDPOINTS.login,
      { username, password },
      { withCredentials: true }
    );

    console.log("[DEBUG] Real API login successful:", response.data);
    return response.data;
    
  } catch (error: any) {
    console.error("[ERROR] Login failed:", error.message);
    throw new Error("Invalid credentials or API unavailable");
  }
}
