import { useState, useEffect } from 'react';
import { Activity, Calendar, RefreshCw } from 'lucide-react';

interface SyncStatusProps {
    lastSync: Date;
    isRefreshing: boolean;
    onRefresh: () => void;
}

export function SyncStatus({ lastSync, isRefreshing, onRefresh }: SyncStatusProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="pb-4">
            <div className="flex items-center mb-4">
                <h3 className="text-white font-semibold">Sync</h3>
                <button
                    onClick={onRefresh}
                    className="p-1.5 bg-grey-raised hover:bg-grey-darker rounded-lg transition-all ml-4"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-4 h-4 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                {/* Live Status */}
                <div className="flex items-center pl-4 space-x-2">
                    <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-500 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                    <span className="text-sm font-medium text-green-500">LIVE</span>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex items-center">
                    <Calendar className="inline w-4 h-4 mr-1 text-grey-contrast" />
                    <span className="text-grey-contrast">
                        {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}{" "}
                        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                </div>
                <div className="flex items-center">
                    <Activity className="inline w-4 h-4 mr-1 text-grey-contrast" />
                    <span className="text-grey-contrast">
                        Last sync: {lastSync.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>
    );
}