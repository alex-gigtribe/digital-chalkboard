// frontend/src/api/auth.ts
// Login API for AdaginTech Portal - DEV VERSION with hardcoded login

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type LoginResponse = {
  token: string;            // JWT / session token
  securityGroupId: string;  // [AdaginSecurityGroup].[ID] (GUID)
  username?: string;        // Optional display name
};

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  
  // DEV MODE - Hardcoded login for testing
  if (import.meta.env.DEV) {
    // Allow admin/admin for development
    if (username === "admin" && password === "admin") {
      const mockResponse: LoginResponse = {
        token: "mock-jwt-token-12345",
        securityGroupId: "dev-security-group-id",
        username: "Admin User"
      };
      
      console.log("[DEBUG] Dev login successful:", mockResponse);
      return new Promise(resolve => setTimeout(() => resolve(mockResponse), 500));
    } else {
      throw new Error("Invalid credentials. Use admin/admin for development.");
    }
  }

  // PRODUCTION - Real API call
  const response = await axiosClient.post<LoginResponse>(
    API_ENDPOINTS.login,
    { username, password },
    { withCredentials: true }
  );

  console.log("[DEBUG] Login response:", response.data);
  return response.data;
}