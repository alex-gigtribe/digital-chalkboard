// frontend/src/components/stats-panel/KPIVariety.tsx
import { useState, useEffect } from "react";
import { fetchVarieties, type VarietiesData } from "@/api/varieties";
import { useDepot } from "../context/DepotContext";

export default function KPIVariety() {
  const { selectedDepot } = useDepot();
  const [varietiesData, setVarietiesData] = useState<VarietiesData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDepot) return;

    let isMounted = true;

    const loadVarieties = async () => {
      try {
        setLoading(true);
        const data = await fetchVarieties(selectedDepot.id);
        if (isMounted) setVarietiesData(data);
      } catch (e) {
        console.warn("Failed to load varieties:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadVarieties();

    // Poll every 5 minutes (less frequent than main dashboard)
    const interval = setInterval(loadVarieties, 50_0000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedDepot]);

  if (!varietiesData || varietiesData.varieties.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b text-sm font-semibold text-navy">
          Variety Breakdown
        </div>
        <div className="p-4 text-center text-gray-500">
          {loading ? "Loading varieties..." : "No variety data available"}
        </div>
      </div>
    );
  }

  const totalBins = varietiesData.varieties.reduce((sum, v) => sum + v.binCount, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b text-sm font-semibold text-navy">
        Variety Breakdown - {varietiesData.totalVarieties} Types
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Variety</th>
              <th className="px-4 py-2 text-right">Bins</th>
              <th className="px-4 py-2 text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {loading && varietiesData.varieties.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse even:bg-gray-50">
                    <td className="px-4 py-2 text-gray-300">Loading...</td>
                    <td className="px-4 py-2 text-right text-gray-300">--</td>
                    <td className="px-4 py-2 text-right text-gray-300">--</td>
                  </tr>
                ))
              : varietiesData.varieties.map((variety, idx) => {
                  const percentage = totalBins > 0 ? (variety.binCount / totalBins * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={variety.varietyId} className="even:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-navy">
                        {variety.varietyName}
                      </td>
                      <td className="px-4 py-2 text-right">{variety.binCount}</td>
                      <td className="px-4 py-2 text-right text-green-600 font-medium">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}

            <tr className="font-semibold bg-gray-100">
              <td className="px-4 py-2">TOTAL</td>
              <td className="px-4 py-2 text-right">{totalBins}</td>
              <td className="px-4 py-2 text-right">100.0%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}