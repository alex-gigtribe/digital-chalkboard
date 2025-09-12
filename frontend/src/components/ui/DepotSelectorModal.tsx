import { useDepot } from "../context/DepotContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DepotSelectorModal() {
  const { depots, selectedDepot, setSelectedDepot, reloadDepots } = useDepot();
  const [localSelection, setLocalSelection] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    reloadDepots();
  }, []);

  if (selectedDepot) return null; // ✅ hide if already selected

  const handleSelect = () => {
    const depot = depots.find((d) => d.id.toString() === localSelection);
    if (depot) {
      setSelectedDepot(depot);
      navigate("/dashboard");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Select Your Depot
        </h2>

        <select
          value={localSelection}
          onChange={(e) => setLocalSelection(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Choose a depot</option>
          {depots.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.zoneName})
            </option>
          ))}
        </select>

        <button
          onClick={handleSelect}
          disabled={!localSelection}
          className="bg-green-600 text-white w-full py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
