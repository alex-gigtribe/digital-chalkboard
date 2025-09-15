// frontend/src/api/qc-pest-issues.ts
// QC Pest Issues from BinScanIn -> FarmPestIssue lookup

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type QCPestIssuesData = {
  totalPestIssues: number;      // Total pest issue count for today
  issueBreakdown: PestIssue[];  // Breakdown by pest type
};

export type PestIssue = {
  issueId: string;              // FarmPestIssue.ID
  issueName: string;            // FarmPestIssue.Name (e.g., "Aphids", "Mites", "Codling Moth")
  count: number;                // Count of this pest issue today
  percentage: number;           // This issue / total issues * 100
  severity: string;             // Severity level if available
  affectedTeams: string[];      // Teams that found this pest issue
};

export async function fetchQCPestIssues(depotId: string): Promise<QCPestIssuesData> {
  try {
    // Backend joins BinScanIn -> CrateScan -> FarmPestIssue
    const response = await axiosClient.get<QCPestIssuesData>(
      `${API_ENDPOINTS.qc}/pest-issues?zoneId=${depotId}`
    );

    if (import.meta.env.DEV) {
      console.log("[DEBUG] QC Pest Issues data:", response.data);
    }

    return response.data;

  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error("[ERROR] QC Pest Issues fetch failed:", {
        depotId,
        message: error.message,
        status: error.response?.status,
      });
    }

    throw error;
  }
}