import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search, Menu, UserCircle, LogOut } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10">
            <div className="flex items-center">
                <button className="md:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none">
                    <Menu className="h-6 w-6" />
                </button>
            </div>
            <div className="flex items-center flex-1 justify-center px-2 lg:ml-6 lg:justify-start">
                <div className="max-w-md w-full relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="search"
                        className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-full leading-5 bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                        placeholder="Search vendors, transactions..."
                    />
                </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <button className="p-2 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <Bell className="h-6 w-6" />
                </button>
                <div className="relative flex items-center gap-2 border-l border-slate-200 pl-4">
                    <UserCircle className="h-8 w-8 text-slate-400" />
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-slate-700">{user?.username}</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                    <button onClick={logout} className="ml-2 p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full transition-colors" title="Logout">
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
