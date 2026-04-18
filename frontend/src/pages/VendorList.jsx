import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorList() {
    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const fetchVendors = () => {
        api.get('/vendors').then(res => setVendors(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleEdit = (vendor) => {
        setEditingId(vendor.id);
        setEditData({ ...vendor });
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/vendors/${editingId}`, editData);
            setVendors(vendors.map(v => v.id === editingId ? { ...v, ...editData } : v));
            setEditingId(null);
            toast.success('Vendor updated successfully');
        } catch (err) {
            toast.error('Failed to update vendor');
        }
    };

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

    const filteredVendors = vendors.filter(v => {
        const matchesSearch = v.vendorName?.toLowerCase().includes(search.toLowerCase()) || 
                              v.category?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'All' ? true : v.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    const formatMoney = (value) => {
        if (value === null || value === undefined) return '-';
        const num = Number(value);
        if (!isFinite(num)) return '-';
        if (num >= 1000000) return '₹' + (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
        return '₹' + Math.round(num).toLocaleString();
    };

    const navigate = useNavigate();

    const parseSpend = (s) => {
        if (!s) return null;
        let v = String(s).replace(/[₹$,\s]/g, '').toLowerCase();
        let multiplier = 1;
        if (v.endsWith('k')) { multiplier = 1000; v = v.slice(0, -1); }
        if (v.endsWith('m')) { multiplier = 1000000; v = v.slice(0, -1); }
        const n = parseFloat(v);
        return isNaN(n) ? null : n * multiplier;
    };

    const getEffectiveSpend = (vendor) => {
        if (vendor.totalSpend != null) return vendor.totalSpend;
        return parseSpend(vendor.email);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Vendors</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage all your company vendors efficiently.</p>
                </div>
                <button onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center font-medium shadow-sm transition-colors">
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
                    <button onClick={() => setFilterStatus(prev => prev === 'All' ? 'Active' : prev === 'Active' ? 'Pending' : prev === 'Pending' ? 'Inactive' : 'All')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 flex items-center hover:bg-slate-50 min-w-[120px] justify-center cursor-pointer transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <Filter className="h-4 w-4 mr-2" />
                        {filterStatus === 'All' ? 'Filter' : filterStatus}
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
                            {filteredVendors.map((vendor) => {
                                const spend = getEffectiveSpend(vendor);
                                return (
                                <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                                    {editingId === vendor.id ? (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input className="border border-slate-300 rounded px-2 py-1.5 w-full text-sm text-slate-900 mb-1 focus:outline-none focus:border-indigo-500" value={editData.vendorName || ''} onChange={e => setEditData({...editData, vendorName: e.target.value})} placeholder="Vendor Name" />
                                                <input className="border border-slate-300 rounded px-2 py-1.5 w-full text-sm text-slate-900 focus:outline-none focus:border-indigo-500" value={editData.companyName || ''} onChange={e => setEditData({...editData, companyName: e.target.value})} placeholder="Company Name" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input className="border border-slate-300 rounded px-2 py-1.5 w-full text-sm text-slate-900 focus:outline-none focus:border-indigo-500" value={editData.contactPerson || ''} onChange={e => setEditData({...editData, contactPerson: e.target.value})} placeholder="Contact Person" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select className="border border-slate-300 rounded px-2 py-1.5 w-full text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-500" value={editData.category || ''} onChange={e => setEditData({...editData, category: e.target.value})}>
                                                    <option value="IT & Software">IT & Software</option>
                                                    <option value="Logistics & Transport">Logistics & Transport</option>
                                                    <option value="Raw Materials">Raw Materials</option>
                                                    <option value="Packaging & Supply">Packaging & Supply</option>
                                                    <option value="Maintenance & Repair">Maintenance & Repair</option>
                                                    <option value="Marketing & Advertising">Marketing & Advertising</option>
                                                    <option value="Legal & Compliance">Legal & Compliance</option>
                                                    <option value="Freelance & Contract">Freelance & Contract</option>
                                                    <option value="General Services">General Services</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select className="border border-slate-300 rounded px-2 py-1.5 w-full text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-500" value={editData.status || ''} onChange={e => setEditData({...editData, status: e.target.value})}>
                                                    <option value="Active">Active</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex flex-col gap-2 items-end">
                                                    <button onClick={handleSaveEdit} className="text-emerald-600 hover:text-emerald-900 text-xs uppercase font-bold cursor-pointer">Save</button>
                                                    <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-slate-700 text-xs uppercase font-bold cursor-pointer">Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                        {vendor.vendorName?.charAt(0) || 'V'}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900">{vendor.vendorName}</div>
                                                        <div className="text-sm text-slate-500">{vendor.companyName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900">{vendor.contactPerson}</div>
                                                <div className="text-sm text-slate-500">
                                                    {spend != null ? formatMoney(spend) : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-700">
                                                    {vendor.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : (vendor.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')}`}>
                                                    {vendor.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleEdit(vendor)} className="text-indigo-600 hover:text-indigo-900 mx-2 p-1 bg-indigo-50 rounded bg-opacity-50 hover:bg-opacity-100 transition-colors cursor-pointer">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(vendor.id)} className="text-rose-600 hover:text-rose-900 mx-2 p-1 bg-rose-50 rounded bg-opacity-50 hover:bg-opacity-100 transition-colors cursor-pointer">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            )})}
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
