import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const CATEGORIES = [
  "Software", "Hardware", "Furniture", "Stationary", "IT services", "Construction", 
  "Electrical", "Plumbing", "Security", "Cleaning and maintenance", "Logistics and transport", 
  "Packaging", "Printing", "Marketing and advertising", "Consulting", "HR and recruitment", 
  "Training", "Food and catering", "Medical and health", "Event management"
];

const prefixes = ["Global", "Apex", "Nova", "Elite", "Pro", "Prime", "Alpha", "Blue", "Vertex", "Omega"];
const suffixes = ["Solutions", "Systems", "Group", "Corp", "Inc", "Partners", "Logistics", "Services", "Tech", "Works"];

// Generates exactly 100 uniquely mocked vendors mapped iteratively
const MOCK_VENDORS = Array.from({ length: 100 }).map((_, i) => {
    const categoryName = CATEGORIES[i % CATEGORIES.length];
    const name = `${prefixes[i % prefixes.length]} ${categoryName.split(' ')[0]} ${suffixes[(Math.floor(i / 10)) % suffixes.length]}`;
    return {
        id: i + 1,
        name: name,
        email: `contact@${name.replace(/[^a-zA-Z]/g, '').toLowerCase()}.com`,
        category: categoryName
    };
});

export default function VendorList() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedVendor, setSelectedVendor] = useState(null);

    const filteredVendors = MOCK_VENDORS.filter(v => {
        const matchesCat = selectedCategory === 'All' || v.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Top 100 Verified Vendors</h2>
                    <p className="text-slate-500 text-sm mt-1">Browse and filter our carefully curated list of world-class operational partners.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search among top vendors..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full md:w-80">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer text-slate-700 font-medium transition-shadow"
                        >
                            <option value="All">All Categories</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-indigo-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredVendors.map(vendor => (
                    <div 
                        key={vendor.id}
                        onClick={() => setSelectedVendor(vendor)}
                        className="bg-white border border-slate-100 rounded-2xl p-5 cursor-pointer hover:scale-105 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between h-36 relative overflow-hidden group"
                    >
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50 z-0"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <h3 className="font-bold text-slate-800 leading-tight">{vendor.name}</h3>
                            <span className="inline-block mt-3 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-wider font-bold rounded-lg w-fit shadow-sm">
                                {vendor.category}
                            </span>
                        </div>
                    </div>
                ))}
                {filteredVendors.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-lg">No vendors found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Premium Details Modal */}
            {selectedVendor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer transition-opacity" 
                        onClick={() => setSelectedVendor(null)}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden transform scale-100 transition-all">
                        {/* Header Graphic */}
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 h-32 w-full absolute top-0 left-0"></div>
                        
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedVendor(null)}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 transition-colors z-20 cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        {/* Content Body */}
                        <div className="pt-16 px-8 pb-8 relative z-10 flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="h-24 w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center text-4xl font-extrabold text-indigo-600 border-4 border-white mb-5 transform -translate-y-2">
                                {selectedVendor.name.charAt(0)}
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-800">{selectedVendor.name}</h2>
                            <p className="inline-block mt-3 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                                {selectedVendor.category}
                            </p>
                            
                            {/* Detailed Info */}
                            <div className="mt-8 w-full space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-transparent">BUSINESS MAIL</p>
                                    <p className="text-slate-700 font-semibold text-sm break-all">{selectedVendor.email}</p>
                                </div>
                                <div className="h-px w-full bg-slate-200"></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">VERIFICATION</p>
                                    <p className="text-emerald-600 font-bold text-sm flex items-center">
                                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2 shadow-sm"></span> 
                                        Top 100 Verified Partner
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
