import { useEffect, useState } from "react";
import { Menu, X, RefreshCw, Wifi, Clock, Lock, LogOut } from "lucide-react";
import CustomDropdown from "../ui/CustomDropdown";
import { useAuth } from "../context/AuthContext";

interface Props {
  depot: string;
  setDepot: (d: string) => void;
  lastSync: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
  depotLocked?: boolean;
}

export function MobileNav({
  depot,
  setDepot,
  lastSync,
  isRefreshing,
  onRefresh,
  depotLocked = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const { user, logout } = useAuth(); // ✅ get actual user + logout

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
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-sm">
            Bin Tracking — <span className="font-bold">{depot || "No Depot Selected"}</span>
            {depotLocked && <Lock className="inline w-4 h-4 ml-1 text-yellow-500" />}
          </h2>
          <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
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

          {/* Online + Sync */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/70"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
              </span>
              <span className="text-sm">Online</span>
            </div>

            <button
              onClick={onRefresh}
              className="px-3 py-1 rounded-md bg-primary text-white hover:brightness-95 flex items-center gap-1"
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

          {/* User Info + Logout */}
          {user && (
            <div className="text-xs opacity-80">
              Logged in as <span className="font-medium">{user.username}</span>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                Updated:&nbsp;{lastSync.toLocaleTimeString()}
              </div>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="mt-3 flex items-center gap-2 text-red-500 hover:text-red-400 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
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
