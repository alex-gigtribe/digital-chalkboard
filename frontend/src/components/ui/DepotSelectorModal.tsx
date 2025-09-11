import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function DepotSelectorModal() {
  const { user, setDepot } = useAuth();
  const [selectedDepot, setSelectedDepotLocal] = useState("");

  if (!user || user.depot !== null) return null; // only show if depot not selected

  const handleSelect = () => {
    if (selectedDepot) setDepot(selectedDepot);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Select Your Depot
        </h2>

        <select
          value={selectedDepot}
          onChange={(e) => setSelectedDepotLocal(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Choose a depot</option>
          {user.depots.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <button
          onClick={handleSelect}
          disabled={!selectedDepot}
          className="bg-green-600 text-white w-full py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
