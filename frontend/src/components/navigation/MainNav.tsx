import { useState, useEffect } from 'react';
import { Activity, Calendar, RefreshCw } from 'lucide-react';

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
        <nav className="flex items-center space-x-8">
            <div className="flex flex-col space-y-2 items-end">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-500 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </div>
                        <span className="text-sm font-medium text-green-500">LIVE</span>
                    </div>
                    <button
                        onClick={onRefresh}
                        className="flex items-center space-x-1 p-2 bg-grey-raised hover:bg-grey-darker rounded-lg transition-all focus:outline-none focus:ring-0 focus:ring-offset-0"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-4 h-4 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-semibold text-white">SYNC</span>
                    </button>
                </div>
                <div className="flex flex-col items-end text-right">
                    <div className="flex items-center space-x-1 text-white text-sm">
                        <Calendar className="w-4 h-4 text-grey-contrast" />
                        <span>
                            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span>
                            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-grey-contrast mt-1">
                        <Activity className="w-4 h-4 text-grey-contrast" />
                        <span>
                            Last sync: {lastSync.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}