// frontend/src/api/employee-attendance.ts
// Employee clock-in/out from EmployeeScanIn/EmployeeScanOut tables

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type EmployeeAttendanceData = {
  totalEmployees: number;       // Total employees who clocked in today
  clockedIn: number;            // Currently clocked in
  clockedOut: number;           // Already clocked out
  teamAttendance: TeamAttendance[];
};

export type TeamAttendance = {
  teamId: string;               // FarmTeamID
  teamName: string;             // Team name
  totalEmployees: number;       // Total employees in team
  present: number;              // Employees who clocked in today
  clockedIn: number;            // Currently working
  clockedOut: number;           // Finished for the day
  attendance: number;           // (present / totalEmployees) * 100
};

export async function fetchEmployeeAttendance(depotId: string): Promise<EmployeeAttendanceData> {
  try {
    // Backend queries EmployeeScanIn/EmployeeScanOut tables
    const response = await axiosClient.get<EmployeeAttendanceData>(
      `${API_ENDPOINTS.employees}/attendance?zoneId=${depotId}`
    );

    if (import.meta.env.DEV) {
      console.log("[DEBUG] Employee Attendance data:", response.data);
    }

    return response.data;

  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error("[ERROR] Employee Attendance fetch failed:", {
        depotId,
        message: error.message,
        status: error.response?.status,
      });
    }

    throw error;
  }
}