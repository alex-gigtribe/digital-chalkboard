// frontend/src/components/stats-panel/KPIQCissues.tsx
import { useState, useEffect } from "react";
import { fetchQCDetails, type QCDetailsData } from "@/api/qc-details";
import { useDepot } from "../context/DepotContext";

export default function KPIQCissues() {
  const { selectedDepot } = useDepot();
  const [qcData, setQcData] = useState<QCDetailsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDepot) return;

    let isMounted = true;

    const loadQCDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchQCDetails(selectedDepot.id);
        if (isMounted) setQcData(data);
      } catch (e) {
        console.warn("Failed to load QC details:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadQCDetails();

    // Poll every 60 seconds (less frequent than main dashboard)
    const interval = setInterval(loadQCDetails, 60_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedDepot]);

  if (!qcData || qcData.totalIssues === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b text-sm font-semibold text-navy">
          QC Issues Breakdown
        </div>
        <div className="p-4 text-center text-gray-500">
          {loading ? "Loading QC data..." : "No QC issues today"}
        </div>
      </div>
    );
  }

  const allIssues = [...qcData.otherIssues, ...qcData.pestIssues];
  const totalIssueCount = allIssues.reduce((sum, issue) => sum + issue.count, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b text-sm font-semibold text-navy">
        QC Issues Breakdown - {qcData.totalIssues} Total Issues
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Issue Type</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-right">Count</th>
              <th className="px-4 py-2 text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {loading && allIssues.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse even:bg-gray-50">
                    <td className="px-4 py-2 text-gray-300">Loading...</td>
                    <td className="px-4 py-2 text-gray-300">--</td>
                    <td className="px-4 py-2 text-right text-gray-300">--</td>
                    <td className="px-4 py-2 text-right text-gray-300">--</td>
                  </tr>
                ))
              : qcData.otherIssues.map((issue, idx) => {
                  const percentage = totalIssueCount > 0 ? (issue.count / totalIssueCount * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={issue.issueId} className="even:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-navy">
                        {issue.issueName}
                      </td>
                      <td className="px-4 py-2 text-orange-600 text-xs font-medium">
                        Other Issue
                      </td>
                      <td className="px-4 py-2 text-right">{issue.count}</td>
                      <td className="px-4 py-2 text-right text-red-600 font-medium">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
            
            {qcData.pestIssues.map((issue, idx) => {
              const percentage = totalIssueCount > 0 ? (issue.count / totalIssueCount * 100).toFixed(1) : "0.0";
              return (
                <tr key={issue.issueId} className="even:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-navy">
                    {issue.issueName}
                  </td>
                  <td className="px-4 py-2 text-red-600 text-xs font-medium">
                    Pest Issue
                  </td>
                  <td className="px-4 py-2 text-right">{issue.count}</td>
                  <td className="px-4 py-2 text-right text-red-600 font-medium">
                    {percentage}%
                  </td>
                </tr>
              );
            })}

            <tr className="font-semibold bg-gray-100">
              <td className="px-4 py-2">TOTAL</td>
              <td className="px-4 py-2">All Categories</td>
              <td className="px-4 py-2 text-right">{qcData.totalIssues}</td>
              <td className="px-4 py-2 text-right">100.0%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}