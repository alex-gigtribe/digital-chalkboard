import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
    children: ReactNode;
}

/**
 * A basic layout component that provides the structural framework for the page.
 * It remains stateless and simply renders its children, header, and footer.
 */
export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background-dark flex flex-col">
            {/* The Header component now handles its own state for navigation props */}
            <Header />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}