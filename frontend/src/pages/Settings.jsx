import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, Monitor, Moon } from 'lucide-react';

export default function Settings() {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="space-y-6 max-w-3xl">
            <h3 className="text-lg font-bold text-[#2d3748]">System Configurations</h3>
            
            <div className="bg-[#f0f2f5] p-6 rounded shadow-sm border border-[#dce1e8]">
                <h4 className="font-semibold text-[#2d3748] mb-4 border-b border-[#cbd5e1] pb-2">Profile Information</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#4a5568] mb-1">Authorized Viewport User</label>
                        <input type="text" disabled defaultValue={user?.username || "admin"} className="w-full bg-[#dce1e8] border border-transparent px-3 py-2 rounded text-sm text-[#718096] cursor-not-allowed" />
                    </div>
                    <div className="pt-4 flex items-center">
                        <button onClick={logout} className="bg-[#c55b5b] hover:bg-[#a24949] text-white px-5 py-2.5 rounded text-sm flex items-center font-medium transition-colors shadow-sm cursor-pointer">
                            <LogOut className="h-4 w-4 mr-2" /> Sign Out Session
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="bg-[#f0f2f5] p-6 rounded shadow-sm border border-[#dce1e8]">
                <h4 className="font-semibold text-[#2d3748] mb-4 border-b border-[#cbd5e1] pb-2">Appearance Layout</h4>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => theme !== 'light' && toggleTheme()}
                        className={`px-5 py-2.5 flex items-center ${theme === 'light' ? 'bg-[#4a72d1] border-2 border-[#4a72d1] text-white' : 'bg-transparent border-2 border-[#cbd5e1] text-[#4a5568] hover:bg-[#dce1e8]'} rounded text-sm font-medium shadow-sm transition-colors cursor-pointer`}
                    >
                        <Monitor className="h-4 w-4 mr-2" />
                        White Label Mode
                    </button>
                    <button 
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        className={`px-5 py-2.5 flex items-center ${theme === 'dark' ? 'bg-[#4a72d1] border-2 border-[#4a72d1] text-white' : 'bg-transparent border-2 border-[#cbd5e1] text-[#4a5568] hover:bg-[#dce1e8]'} rounded text-sm font-medium shadow-sm transition-colors cursor-pointer`}
                    >
                        <Moon className="h-4 w-4 mr-2" />
                        Dark Mode
                    </button>
                </div>
            </div>
        </div>
    );
}
