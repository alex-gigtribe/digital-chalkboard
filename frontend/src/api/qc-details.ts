// frontend/src/api/qc-details.ts
// QC details API - DEV VERSION with hardcoded QC issue data

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

function generateMockQCData(): QCDetailsData {
  const otherIssues: QCIssue[] = [
    { issueId: "other-1", issueName: "Defekte", count: 3 },
    { issueId: "other-2", issueName: "Kiste te vol", count: 2 },
    { issueId: "other-3", issueName: "Lae Suikers", count: 1 }
  ];

  const pestIssues: QCIssue[] = [
    { issueId: "pest-1", issueName: "Kodlingmots", count: 2 },
    { issueId: "pest-2", issueName: "Witluis", count: 1 },
    { issueId: "pest-3", issueName: "Aphids", count: 1 }
  ];

  const totalIssues = [...otherIssues, ...pestIssues].reduce((sum, issue) => sum + issue.count, 0);

  return {
    totalIssues,
    otherIssues,
    pestIssues,
    lastUpdated: new Date().toISOString()
  };
}

export async function fetchQCDetails(depotId: string): Promise<QCDetailsData> {
  
  // DEV MODE - Generate mock QC data
  if (!import.meta.env.DEV) {
    const mockData = generateMockQCData();
    console.log("[DEBUG] QC Details mock data:", mockData);
    return new Promise(resolve => setTimeout(() => resolve(mockData), 350));
  }

  // PRODUCTION - Real API call
  try {
    const response = await axiosClient.get<QCDetailsData>(
      `${API_ENDPOINTS.qcDetails}?zoneId=${depotId}`
    );

    console.log("[DEBUG] QC raw data:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("[ERROR] QC details fetch failed:", {
      depotId,
      message: error.message,
      status: error.response?.status,
    });

    throw error;
  }
}