// frontend/src/api/auth.ts
// Login API with admin/admin mock & prod for testing in all environments

import axiosClient from "./axiosClient";
import { encryptPassword } from "@/utils/cryptoHelpers";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";
import type { AuthenticateResult } from "@/types/auth";


// const BINS_PER_PERSON_TARGET = 24; // Constant: 24 bins per person

export async function loginUser(username: string,password: string): Promise<AuthenticateResult> {
  
  // Allow admin/admin for testing in ALL environments (dev and production)
  if (username === "admin" && password === "admin") {
    const mockResponse: AuthenticateResult = {
      token: "mock-jwt-token-12345",
      securityGroupUser: {
        securityGroupId: "mock-security-group-id",
        username: "admin",
        name: "Admin User (Demo)"
      }
    };
    
    console.log("[DEBUG] Mock login successful:", mockResponse);
    return new Promise(resolve => setTimeout(() => resolve(mockResponse), 500));
  }

  const encryptedPassword = encryptPassword(password);

  // For all other credentials, try real API
  try {
    const response = await axiosClient.post<AuthenticateResult>(
      API_ENDPOINTS.login,
      {
        name: username,
        encodedpasswordhash: encryptedPassword, // send encrypted version
      },
      //{ withCredentials: true }
    );

    console.log("[DEBUG] Real API login successful:", response.data);
    return response.data;
    
  } catch (error: any) {
    console.error("[ERROR] Login failed:", error.message);
    throw new Error("Invalid credentials or API unavailable");
  }
}
