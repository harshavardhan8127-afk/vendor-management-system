import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search } from 'lucide-react';

export default function Layout() {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-[#dce1e8] text-[#333] font-sans antialiased">
            <Sidebar />
            
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="h-20 flex items-center justify-between px-8 border-b border-[#c8ccd4] bg-transparent">
                    <h2 className="text-xl font-bold text-[#2d3748]">Vendor Management Dashboard</h2>
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            className="w-full pl-3 pr-10 py-2 border border-transparent rounded bg-[#f0f2f5] text-sm focus:bg-white focus:outline-none transition-colors"
                        />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
