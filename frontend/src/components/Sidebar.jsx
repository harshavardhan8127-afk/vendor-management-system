import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, FileText, Settings, Layers } from 'lucide-react';

export default function Sidebar() {
    const links = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Vendors', path: '/vendors', icon: Users },
        { name: 'Transactions', path: '/transactions', icon: CreditCard },
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-[#f0f2f5] border-r border-[#c8ccd4] flex flex-col z-10 shadow-sm relative">
            <div className="h-20 flex items-center px-6 space-x-2">
                <div className="w-8 h-8 rounded bg-[#4a72d1] flex items-center justify-center">
                    <Layers className="text-white h-5 w-5" />
                </div>
                <h1 className="text-[#3b5998] text-2xl font-bold tracking-tight">TradeFlow</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-[#4a72d1] text-white border-l-4 border-[#2b4c9e]'
                                            : 'text-[#4a5568] hover:bg-[#e2e6eb]'
                                    }`
                                }
                            >
                                <Icon className="mr-4 h-5 w-5" />
                                {link.name}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
