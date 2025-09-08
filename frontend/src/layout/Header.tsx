import { useState, useEffect, useRef, useCallback } from 'react';
import { MainNav } from '../components/navigation/MainNav';
import { MobileNav } from '../components/navigation/MobileNav';

export function Header() {
    const [lastSync, setLastSync] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setLastSync(new Date());
            setIsRefreshing(false);
            timerRef.current = null;
        }, 2000);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <header className="bg-background-accent border-none sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                    <img src="/Adagin-logo.svg" alt="AdaginTech" className="h-12 md:h-16 lg:h-20 w-auto" />
                    <div>
                        <h1 className="text-white font-extrabold text-sm md:text-lg lg:text-2xl leading-tight">
                            <span className="md:hidden">Bin Tracking System</span>
                            <span className="hidden md:inline">AdaginTech Bin Tracking System</span>
                        </h1>
                        <p className="hidden md:block text-sm lg:text-lg text-grey-contrast">
                            Powered by Adagintech.com <span className="text-secondary">×</span> Metaship.ai
                        </p>
                    </div>
                </div>
                <div className="md:hidden">
                    <MobileNav
                        lastSync={lastSync}
                        isRefreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                </div>
                <div className="hidden md:block">
                    <MainNav
                        lastSync={lastSync}
                        isRefreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                </div>
            </div>
        </header>
    );
}