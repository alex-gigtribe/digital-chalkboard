import { useCallback, useEffect, useRef, useState } from "react";
import { Wifi, Clock, RefreshCw, Lock } from "lucide-react";
import CustomDropdown from "../components/ui/CustomDropdown";
import { MobileNav } from "../components/navigation/MobileNav";
import { useDepot } from "../components/context/DepotContext";
import { useAuth } from "../components/context/AuthContext";

export function Header() {
  const { depots, selectedDepot, setSelectedDepot } = useDepot();
  const { user, logout } = useAuth();

  const depotName = selectedDepot ? selectedDepot.name : "";

  const [lastSync, setLastSync] = useState<Date>(() => {
    const key = `lastSync_${depotName}`;
    const v = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return v ? new Date(v) : new Date();
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Watch localStorage last sync changes when depot changes
  useEffect(() => {
    const key = `lastSync_${depotName}`;
    const v = localStorage.getItem(key);
    if (v) setLastSync(new Date(v));
  }, [depotName]);

  // Listen for online/offline events from browser and API
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Custom events fired by fetchStats/fetchTeams when API fails/succeeds
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const now = new Date();
      setLastSync(now);
      try {
        localStorage.setItem(`lastSync_${depotName}`, now.toISOString());
      } catch {}
      setIsRefreshing(false);
      timerRef.current = null;
    }, 900);
  }, [depotName]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDepotChange = (value: string) => {
    if (!selectedDepot) {
      const depot = depots.find((d) => d.name === value);
      if (depot) setSelectedDepot(depot);
    }
  };

  const isDepotLocked = !!selectedDepot;

  return (
    <header className="bg-navy text-white sticky top-0 z-50 shadow-subtle">
      <div className="max-w-container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <img src="/Adagin-logo.svg" alt="AdaginTech" className="h-11 w-auto md:h-20" />
          <div className="truncate leading-tight">
            <h1 className="hidden md:block font-semibold text-base md:text-lg truncate flex items-center gap-2">
              Bin Tracking Team Summary —{" "}
              <span className="font-bold flex items-center gap-1">
                {depotName || "No Depot Selected"}
                {isDepotLocked && <Lock className="w-4 h-4 text-yellow-300" />}
              </span>
            </h1>
            <div className="md:hidden flex flex-col">
              <span className="font-semibold text-sm leading-tight">Bin Tracking</span>
              <span className="font-bold text-sm leading-tight flex items-center gap-1">
                {depotName || "No Depot Selected"}
                {isDepotLocked && <Lock className="w-3 h-3 text-yellow-300" />}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-stretch gap-3">
          {/* Online/Offline Status */}
          <div className={`h-10 px-3 rounded-md flex items-center gap-2 ${isOnline ? "bg-white/10" : "bg-red-600/20"}`}>
            <Wifi className={`w-4 h-4 ${isOnline ? "text-green-400" : "text-red-400"}`} />
            <span className="relative flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full rounded-full ${isOnline ? "bg-green-400 animate-ping" : "bg-red-400 animate-pulse"} opacity-60`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? "bg-green-400" : "bg-red-400"}`} />
            </span>
            <span className="text-sm opacity-90">{isOnline ? "Online" : "Offline"}</span>
          </div>

          {/* Depot Selector - Disabled when locked */}
          <div className={`h-10 ${isDepotLocked ? "opacity-50 pointer-events-none" : ""}`}>
            <CustomDropdown
              options={depots.map((d) => d.name)}
              value={depotName}
              onChange={handleDepotChange}
            />
          </div>

          {/* Sync Button */}
          <button
            onClick={onRefresh}
            className="h-10 px-3 rounded-md bg-primary hover:brightness-95 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="text-sm font-semibold">Sync</span>
          </button>

          {/* Logged-in User Info + Logout */}
          {user && (
            <div className="h-10 px-2 flex flex-col justify-center leading-tight">
              <span className="text-[11px] opacity-90">Logged in as {user.username}</span>
              <span className="text-[11px] opacity-80 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated:&nbsp;{lastSync.toLocaleTimeString()}
              </span>
              <button
                onClick={logout}
                className="text-[11px] underline text-red-400 hover:text-red-300 mt-1"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileNav
            depot={depotName}
            setDepot={handleDepotChange}
            lastSync={lastSync}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
            depotLocked={isDepotLocked} //  passes lock state
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
