// frontend/src/components/navigation/MobileNav.tsx
import { useEffect, useState } from "react";
import { Menu, X, RefreshCw, Wifi, Clock, Lock, LogOut, AlertCircle } from "lucide-react";
import CustomDropdown from "../ui/CustomDropdown";
import { useAuth } from "../context/AuthContext";

interface Props {
  depot: string;
  setDepot: (d: string) => void;
  lastSync: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
  depotLocked?: boolean;
  isOnline?: boolean;
  error?: string | null;
}

export function MobileNav({
  depot,
  setDepot,
  lastSync,
  isRefreshing,
  onRefresh,
  depotLocked = false,
  isOnline = true,
  error = null,
}: Props) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const { user, logout } = useAuth();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const DEPOTS = [
    "Hutton Squire 1",
    "Hutton Squire 2",
    "Hutton Squire 3",
    "Hutton Squire 4",
    "Hutton Squire 5",
    "Hutton Squire 6",
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-white hover:bg-white/10 rounded-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      <aside
        className={`fixed inset-y-0 right-0 w-72 bg-white text-navy rounded-l-md shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          !isOnline ? 'bg-red-50 border-red-200' : ''
        }`}>
          <h2 className="font-semibold text-sm flex items-center gap-1">
            Bin Tracking — <span className="font-bold">{depot || "No Depot Selected"}</span>
            {depotLocked && <Lock className="inline w-4 h-4 ml-1 text-yellow-500" />}
            {error && <AlertCircle className="w-4 h-4 text-orange-500" />}
          </h2>
          <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
          {/* Offline warning */}
          {!isOnline && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <div>
                <div className="text-sm font-medium text-red-800">Offline Mode</div>
                <div className="text-xs text-red-600">Showing cached data</div>
              </div>
            </div>
          )}

          {/* Depot selector (disabled if locked) */}
          <CustomDropdown
            options={DEPOTS}
            value={depot}
            onChange={(d: string) => {
              setDepot(d);
              setOpen(false);
            }}
            disabled={depotLocked}
          />

          {/* Online/Offline + Sync */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className={`w-4 h-4 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
              <span className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-70 ${
                  isOnline ? "bg-green-400 animate-ping" : "bg-red-400 animate-pulse"
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isOnline ? "bg-green-400" : "bg-red-400"
                }`}></span>
              </span>
              <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
            </div>

            <button
              onClick={onRefresh}
              className={`px-3 py-1 rounded-md text-white hover:brightness-95 flex items-center gap-1 ${
                isOnline ? "bg-primary" : "bg-red-600"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="text-sm font-semibold">Sync</span>
            </button>
          </div>

          {/* Date + Time */}
          <div className="bg-gray-50 rounded-md p-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <div>
              <div className="text-sm">
                {now.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="text-xs opacity-80">{now.toLocaleTimeString()}</div>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-sm font-medium">
                Logged in as {user.username}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                <Clock className="w-3 h-3" />
                Updated: {lastSync.toLocaleTimeString()}
                {error && <span className="text-orange-500 ml-1">(Cached)</span>}
              </div>
            </div>
          )}

          {/* Logout Button */}
          {user && (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-md text-white font-semibold flex items-center justify-center gap-2 ${
                isOnline ? "bg-primary hover:brightness-95" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t text-center text-xs opacity-70">
          © 2025 AdaginTech · Hutton Squire
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />}
    </>
  );
}

export default MobileNav;