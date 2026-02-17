import React from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    activePage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activePage,
    onNavigate,
    onLogout,
}) => {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar activePage={activePage} onNavigate={onNavigate} onLogout={onLogout} />

            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
