import { useState, useEffect } from "react";
import { Menu, X, RefreshCw, Wifi, Clock } from "lucide-react";
import CustomDropdown from "../../components/ui/CustomDropdown";

const DEPOTS = [
  "Hutton Squire 1",
  "Hutton Squire 2",
  "Hutton Squire 3",
  "Hutton Squire 4",
  "Hutton Squire 5",
  "Hutton Squire 6",
];

interface Props {
  lastSync: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
  depot: string;
  setDepot: (d: string) => void;
}

export function MobileNav({ lastSync, isRefreshing, onRefresh, depot, setDepot }: Props) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-white hover:bg-white/10 rounded-md focus-ring"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 w-72 bg-white text-navy rounded-l-md shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header bar */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-sm">
            Bin Tracking — <span className="font-bold">{depot}</span>
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 focus-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer content */}
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
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
              className="px-3 py-1 rounded-md bg-primary text-white hover:brightness-95 focus-ring flex items-center gap-1"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="text-sm font-semibold">Sync</span>
            </button>
          </div>

          {/* Date & Time */}
          <div className="bg-gray-50 rounded-md p-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <div>
              <div className="text-sm">
                {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </div>
              <div className="text-xs opacity-80">
                {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
            </div>
          </div>

          {/* Logged in */}
          <div className="text-xs opacity-80">
            Logged in as <span className="font-medium">admin@huttonsquire.com</span>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              Updated:&nbsp;
              {lastSync.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Footer + Dropdown */}
        <div className="p-3 border-t text-center text-xs opacity-70 space-y-3">
          <p>© 2025 AdaginTech · Hutton Squire</p>
          <div className="flex justify-center">
            <CustomDropdown options={DEPOTS} value={depot} onChange={setDepot} />
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />}
    </>
  );
}
