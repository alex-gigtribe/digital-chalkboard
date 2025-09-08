import { useState, useEffect } from 'react';
import { Menu, X, Activity, Calendar, RefreshCw } from 'lucide-react';

interface MobileNavProps {
    lastSync: Date;
    isRefreshing: boolean;
    onRefresh: () => void;
}

export function MobileNav({ lastSync, isRefreshing, onRefresh }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleMenu}
                    className="p-2 text-white hover:bg-grey-darker rounded-lg transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-0 right-0 h-full w-80 bg-background-accent border-none z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col justify-between">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-white text-lg font-semibold">System Dashboard</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-white hover:bg-grey-darker rounded-lg focus:outline-none focus:ring-0 focus:ring-offset-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    <div className="relative">
                                        <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-500 opacity-75 animate-ping"></span>
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
                            <div className="space-y-3">
                                <div className="bg-grey-raised rounded-lg p-3">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-grey-contrast" />
                                        <div>
                                            <div className="text-white text-sm font-medium">
                                                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="text-grey-contrast text-xs">
                                                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-grey-raised rounded-lg p-3">
                                    <div className="flex items-center space-x-2">
                                        <Activity className="w-4 h-4 text-grey-contrast" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Last Sync</div>
                                            <div className="text-grey-contrast text-xs">
                                                {lastSync.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 pt-0 text-center text-grey-contrast text-sm">
                            <p>Powered by Adagintech.com <span className="text-secondary">×</span> Metaship.ai</p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}