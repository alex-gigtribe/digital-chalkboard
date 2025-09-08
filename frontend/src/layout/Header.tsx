import { useState, useEffect, useRef, useCallback } from "react";
import { Wifi, Clock, RefreshCw } from "lucide-react";
import CustomDropdown from "../components/ui/CustomDropdown";
import { MobileNav } from "../components/navigation/MobileNav";
import { useDepot } from "../components/context/DepotContext";

export function Header() {
  const { depot, setDepot, DEPOTS } = useDepot();
  const [lastSync, setLastSync] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 const onRefresh = useCallback(() => {
  setIsRefreshing(true);
  if (timerRef.current) clearTimeout(timerRef.current);
  timerRef.current = setTimeout(() => {
    setLastSync(new Date()); 
    setIsRefreshing(false);
    timerRef.current = null;
  }, 1200);
}, []);


  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <header className="bg-navy text-white sticky top-0 z-50 shadow-subtle">
      <div className="max-w-container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Left: logo + title */}
        <div className="flex items-center gap-3 min-w-0">
          <img src="/Adagin-logo.svg" alt="AdaginTech" className="h-11 w-auto md:h-12" />
          <div className="truncate leading-tight">
            {/* Desktop */}
            <h1 className="hidden md:block font-semibold text-base md:text-lg truncate">
              Bin Tracking Team Summary — <span className="font-bold">{depot}</span>
            </h1>
            {/* Mobile */}
            <div className="md:hidden flex flex-col">
              <span className="font-semibold text-sm leading-tight">Bin Tracking</span>
              <span className="font-bold text-sm leading-tight">{depot}</span>
            </div>
          </div>
        </div>

        {/* Right: desktop */}
        <div className="hidden md:flex items-stretch gap-3">
          <div className="h-10 px-3 rounded-md bg-white/10 flex items-center gap-2">
            <Wifi className="w-4 h-4 opacity-90" />
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
            </span>
            <span className="text-sm opacity-90">Online</span>
          </div>

          <div className="h-10">
            <CustomDropdown options={DEPOTS} value={depot} onChange={setDepot} />
          </div>

          <button
            onClick={onRefresh}
            className="h-10 px-3 rounded-md bg-primary hover:brightness-95 flex items-center gap-2 focus-ring"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="text-sm font-semibold">Sync</span>
          </button>

          <div className="h-10 px-2 flex flex-col justify-center leading-tight">
            <span className="text-[11px] opacity-90">Logged in as admin@huttonsquire.com</span>
            <span className="text-[11px] opacity-80 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated:&nbsp;
              {lastSync.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <MobileNav
            depot={depot}
            setDepot={setDepot}
            lastSync={lastSync}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        </div>
      </div>
    </header>
  );
}
