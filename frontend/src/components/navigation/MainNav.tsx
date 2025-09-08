import { useState, useEffect } from "react";
import { Activity, Calendar, RefreshCw } from "lucide-react";

interface MainNavProps {
  lastSync: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function MainNav({ lastSync, isRefreshing, onRefresh }: MainNavProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="flex items-center space-x-6">
      <div className="flex flex-col space-y-2 items-end">
        {/* Live + Sync */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-4 w-4 rounded-full bg-success opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
            </div>
            <span className="text-sm font-medium text-success">LIVE</span>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary text-white hover:brightness-95 focus-ring"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="text-sm font-semibold">SYNC</span>
          </button>
        </div>

        {/* Date / Time / Last sync */}
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-2 text-sm text-white">
            <Calendar className="w-4 h-4 text-white/70" />
            <span>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/70 mt-1">
            <Activity className="w-4 h-4" />
            <span>
              Last sync:{" "}
              {lastSync.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default MainNav;