import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorList() {
    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState('');

    const fetchVendors = () => {
        api.get('/vendors').then(res => setVendors(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this vendor?')) {
            try {
                await api.delete(`/vendors/${id}`);
                setVendors(vendors.filter(v => v.id !== id));
                toast.success('Vendor deleted successfully');
            } catch (err) {
                toast.error('Failed to delete vendor');
            }
        }
    };

    const filteredVendors = vendors.filter(v => 
        v.vendorName?.toLowerCase().includes(search.toLowerCase()) || 
        v.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Vendors</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage all your company vendors efficiently.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center font-medium shadow-sm transition-colors">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Vendor
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative max-w-sm w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 flex items-center hover:bg-slate-50">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                {vendor.vendorName.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{vendor.vendorName}</div>
                                                <div className="text-sm text-slate-500">{vendor.companyName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900">{vendor.contactPerson}</div>
                                        <div className="text-sm text-slate-500">{vendor.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-700">
                                            {vendor.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mx-2 p-1 bg-indigo-50 rounded bg-opacity-50 hover:bg-opacity-100 transition-colors">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(vendor.id)} className="text-rose-600 hover:text-rose-900 mx-2 p-1 bg-rose-50 rounded bg-opacity-50 hover:bg-opacity-100 transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredVendors.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        No vendors found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
