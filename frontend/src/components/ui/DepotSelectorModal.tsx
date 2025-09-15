import { useDepot } from "../context/DepotContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DepotSelectorModal() {
  const { depots, selectedDepot, setSelectedDepot, reloadDepots } = useDepot();
  const [localSelection, setLocalSelection] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    reloadDepots(); //  now exists
  }, []);

  if (selectedDepot) return null; // hide if already selected

  const handleSelect = () => {
    const depot = depots.find((d) => d.id.toString() === localSelection);
    if (depot) {
      setSelectedDepot(depot);
      navigate("/"); // redirect after selection
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto my-8 min-h-fit">
        {/* Header with logo */}
        <div className="text-center pt-8 pb-6">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/Adagin-logo.png" 
              alt="Adagin Technologies" 
              className="h-16 w-auto"
            />
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <div className="mb-6">
            <label htmlFor="depot" className="block text-sm font-medium text-gray-700 mb-1">
              Select Depot
            </label>
            <select
              id="depot"
              value={localSelection}
              onChange={(e) => setLocalSelection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a depot</option>
              {depots.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSelect}
            disabled={!localSelection}
            className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}