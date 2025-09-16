// frontend/src/api/qc-details.ts
// QC details API - fetches raw QC issue data only, no calculations

import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../../endpoints/requestedEndpoints";

export type QCDetailsData = {
  totalIssues: number;      // Raw count
  otherIssues: QCIssue[];   // Raw issue data
  pestIssues: QCIssue[];    // Raw issue data
  lastUpdated: string;
};

export type QCIssue = {
  issueId: string;          // Raw ID
  issueName: string;        // Issue name from lookup
  count: number;            // Raw count only
};

export async function fetchQCDetails(depotId: string): Promise<QCDetailsData> {
  try {
    const response = await axiosClient.get<QCDetailsData>(
      `${API_ENDPOINTS.qcDetails}?zoneId=${depotId}`
    );

    if (import.meta.env.DEV) {
      console.log("[DEBUG] QC raw data:", response.data);
    }

    return response.data;

  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error("[ERROR] QC details fetch failed:", {
        depotId,
        message: error.message,
        status: error.response?.status,
      });
    }

    throw error;
  }
}