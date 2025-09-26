// frontend/src/layout/Header.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Wifi, Clock, RefreshCw, Lock, AlertCircle } from "lucide-react";
import CustomDropdown from "../components/ui/CustomDropdown";
import { MobileNav } from "../components/navigation/MobileNav";
import { useDepot } from "../components/context/DepotContext";
import { useAuth } from "../components/context/AuthContext";
import { useStats } from "../components/context/StatsContext";

export function Header() {
  const { depots, selectedDepot, setSelectedDepot } = useDepot();
  const { user, logout } = useAuth();
  const { isOnline, error, lastUpdated } = useStats();

  const depotName = selectedDepot ? selectedDepot.name : "";
  const farmName = selectedDepot ? selectedDepot.farmName : "";
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Parse lastUpdated from context or fallback to localStorage
  const parsedLastSync = lastUpdated ? new Date(lastUpdated) : new Date();

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsRefreshing(false);
      timerRef.current = null;
    }, 900);
  }, []);

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

  // Header background classes with red flashing for offline
  const headerClasses = `bg-navy text-white sticky top-0 z-50 shadow-subtle transition-colors duration-300 ${
    !isOnline ? 'animate-pulse bg-red-800/90' : ''
  }`;

  return (
    <header className={headerClasses}>
      <div className="max-w-container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <img src="/Adagin-logo.svg" alt="AdaginTech" className="h-11 w-auto md:h-20" />
          <div className="truncate leading-tight">
            <div className="hidden md:block">
              {farmName && (
                <div className="font-medium text-sm text-white/90 mb-1">
                  {farmName}
                </div>
              )}
              <h1 className="font-semibold text-base md:text-lg truncate flex items-center gap-2">
                Bin Tracking Team Summary —{" "}
                <span className="font-bold flex items-center gap-1">
                  {depotName || "No Depot Selected"}
                  {isDepotLocked && <Lock className="w-4 h-4 text-yellow-300" />}
                </span>
                {error && (
                  <span className="flex items-center gap-1 text-orange-300 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Cached Data
                  </span>
                )}
              </h1>
            </div>
            <div className="md:hidden flex flex-col">
              {farmName && (
                <span className="font-medium text-xs text-white/90 leading-tight">
                  {farmName}
                </span>
              )}
              <span className="font-semibold text-sm leading-tight">Bin Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-stretch gap-3">
          {/* Online/Offline Status */}
          <div className={`h-10 px-3 rounded-md flex items-center gap-2 transition-colors duration-300 ${
            isOnline ? "bg-white/10" : "bg-red-600/30 border border-red-400/50"
          }`}>
            <Wifi className={`w-4 h-4 transition-colors ${
              isOnline ? "text-green-400" : "text-red-400"
            }`} />
            <span className="relative flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${
                isOnline 
                  ? "bg-green-400 animate-ping" 
                  : "bg-red-400 animate-pulse"
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isOnline ? "bg-green-400" : "bg-red-400"
              }`} />
            </span>
            <span className="text-sm opacity-90">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          {/* Depot Selector - Disabled when locked */}
          <div className={`${isDepotLocked ? "opacity-50 pointer-events-none" : ""}`}>
            <CustomDropdown
              options={depots.map((d) => d.name)}
              value={depotName}
              onChange={handleDepotChange}
              className="h-10"
            />
          </div>

          {/* Sync Button */}
          <button
            onClick={onRefresh}
            className={`h-10 px-3 rounded-md flex items-center gap-2 transition-colors ${
              isOnline 
                ? "bg-primary hover:brightness-95" 
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="text-sm font-semibold">Sync</span>
          </button>

          {/* User Info */}
          {user && (
            <div className="h-10 px-3 rounded-md bg-white/10 flex flex-col justify-center leading-tight">
              <span className="text-sm opacity-90">
                Logged in as {user.username}
              </span>
              <span className="text-xs opacity-80 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated: {parsedLastSync.toLocaleTimeString()}
                {error && (
                  <span className="text-orange-300 ml-1">(Cached)</span>
                )}
              </span>
            </div>
          )}

          {/* Logout Button */}
          {user && (
            <button
              onClick={logout}
              className={`h-10 px-3 rounded-md flex items-center gap-2 transition-colors ${
                isOnline 
                  ? "bg-primary hover:brightness-95" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <span className="text-sm font-semibold text-white">Logout</span>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileNav
            depot={depotName}
            setDepot={handleDepotChange}
            lastSync={parsedLastSync}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
            depotLocked={isDepotLocked}
            isOnline={isOnline}
            error={error}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;