// frontend/src/api/qc-other-issues.ts
// QC Other Issues from BinScanIn -> FarmOtherIssue lookup

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type QCOtherIssuesData = {
  totalOtherIssues: number;     // Total other issue count for today
  issueBreakdown: OtherIssue[]; // Breakdown by issue type
};

export type OtherIssue = {
  issueId: string;              // FarmOtherIssue.ID
  issueName: string;            // FarmOtherIssue.Name (e.g., "Bruising", "Overripe")
  count: number;                // Count of this issue today
  percentage: number;           // This issue / total issues * 100
  affectedTeams: string[];      // Teams that had this issue
};

export async function fetchQCOtherIssues(depotId: string): Promise<QCOtherIssuesData> {
  try {
    // Backend joins BinScanIn -> CrateScan -> FarmOtherIssue
    const response = await axiosClient.get<QCOtherIssuesData>(
      `${API_ENDPOINTS.qc}/other-issues?zoneId=${depotId}`
    );

    if (import.meta.env.DEV) {
      console.log("[DEBUG] QC Other Issues data:", response.data);
    }

    return response.data;

  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error("[ERROR] QC Other Issues fetch failed:", {
        depotId,
        message: error.message,
        status: error.response?.status,
      });
    }

    throw error;
  }
}