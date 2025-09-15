// // frontend/src/api/auth.ts
// // Login API for AdaginTech Portal
// // Backend table reference: [AdaginTech].[AdaginSecurityGroup] (SecurityGroupID)
// // This call should only return a token + SecurityGroupID, no depots/zones here.

// import axiosClient from "./axiosClient";
// import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

// export type LoginResponse = {
//   token: string;            // JWT / session token
//   securityGroupId: string;  // [AdaginSecurityGroup].[ID] (GUID)
//   username?: string;        // Optional display name
// };

// export async function loginUser(
//   username: string,
//   password: string
// ): Promise<LoginResponse> {
//   // Login API call (live endpoint handled in requestedEndpoints.ts) aka API_ENDPOINTS, login 
//   const response = await axiosClient.post<LoginResponse>(
//     API_ENDPOINTS.login,
//     { username, password },
//     { withCredentials: true }
//   );

//   // axiosClient will attach token to all subsequent requests automatically
//   return response.data;
// }
import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type LoginResponse = {
  token: string;
  securityGroupId: string;
  username?: string;
};

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await axiosClient.post<LoginResponse>(
    API_ENDPOINTS.login,
    { username, password },
    { withCredentials: true }
  );

  if (import.meta.env.DEV) {
    console.log("[DEBUG] Login response:", response.data);
  }

  return response.data;
}
