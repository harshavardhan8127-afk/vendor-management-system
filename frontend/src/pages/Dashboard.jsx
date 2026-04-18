import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Dashboard() {
    const [vendors, setVendors] = useState([]);
    const [summary, setSummary] = useState({ 
        totalVendors: 0,
        totalSpend: 0,
        avgPerformance: 0,
        openOrders: 0
    });

    const [formData, setFormData] = useState({
        vendorName: '',
        category: '',
        status: 'Active',
        totalSpend: '',
        paymentTerms: '',
        lastOrder: '',
    });

    useEffect(() => {
        fetchVendors();
        fetchSummary();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await api.get('/vendors');
            setVendors(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching vendors:", err);
            setVendors([]);
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await api.get('/dashboard/summary');
            setSummary(res.data);
        } catch (err) {
            console.error("Error fetching summary:", err);
        }
    }

    // parse displayed spend like "₹25K" or "30000" into a number
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

    const handleAdd = async (e) => {
        e.preventDefault();
        try {

            const payload = {
                vendorName: formData.vendorName,
                category: formData.category,
                status: formData.status,
                companyName: formData.paymentTerms,
                totalSpend: parseSpend(formData.totalSpend),
                contactPerson: formData.lastOrder,
            };
            await api.post('/vendors', payload);
            toast.success('Vendor added successfully');
            fetchVendors();
            fetchSummary();
            setFormData({ vendorName: '', category: '', status: 'Active', totalSpend: '', paymentTerms: '', lastOrder: '' });
        } catch (err) {
            console.error("Error adding vendor:", err);
            toast.error('Error adding vendor');
        }
    };

    const handleDelete = async (id) => {
        // Removed window.confirm so it doesn't block interactions
        try {
            await api.delete(`/vendors/${id}`);
            toast.success('Vendor deleted successfully');
            fetchVendors();
            fetchSummary();
        } catch (err) {
            console.error("Error deleting vendor:", id, err);
            toast.error('Error deleting vendor - check console for details');
        }
    };

    // Format a numeric total spend coming from the backend summary
    const formatTotalSpend = (value) => {
        if (!value) return '0';
        const total = Number(value);
        if (isNaN(total) || total === 0) return '0';
        if (total >= 1000000) return (total / 1000000).toFixed(1) + 'M';
        if (total >= 1000) return (total / 1000).toFixed(1) + 'K';
        return Math.round(total).toLocaleString();
    };

    // Use backend-provided average performance when available
    const getAvgPerformance = () => {
        return summary.avgPerformance || 0;
    };

    // Compute pending orders based on vendors with 'Pending' status
    const getOpenOrders = () => {
        return vendors.filter(v => v.status === 'Pending').length;
    };

    // Chart Data Preparation
    const spendByCategory = React.useMemo(() => {
        const data = {};
        vendors.forEach(v => {
            const cat = v.category || 'Uncategorized';
            const spend = getEffectiveSpend(v) || 0;
            data[cat] = (data[cat] || 0) + spend;
        });
        return Object.entries(data)
            .map(([name, spend]) => ({ name, spend }))
            .sort((a, b) => b.spend - a.spend);
    }, [vendors]);

    const vendorStatusData = React.useMemo(() => {
        const data = { Active: 0, Pending: 0, Inactive: 0 };
        vendors.forEach(v => {
            const status = v.status || 'Active';
            if (data[status] !== undefined) {
                data[status] += 1;
            } else {
                data['Active'] += 1;
            }
        });
        return [
            { name: 'Active', value: data.Active, fill: '#5eab5e' },
            { name: 'Pending', value: data.Pending, fill: '#ed8936' },
            { name: 'Inactive', value: data.Inactive, fill: '#c55b5b' },
        ].filter(d => d.value > 0);
    }, [vendors]);

    return (
        <div className="space-y-8 max-w-6xl">
            {/* 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#f0f2f5] p-5 rounded shadow-sm border-t-4 border-[#4a72d1]">
                    <p className="text-sm font-semibold text-[#4a5568] mb-2">Total Vendors</p>
                    <p className="text-3xl text-[#2d3748]">{summary.totalVendors || 0}</p>
                </div>
                <div className="bg-[#f0f2f5] p-5 rounded shadow-sm border-t-4 border-[#5eab5e]">
                    <p className="text-sm font-semibold text-[#4a5568] mb-2">Total Spend</p>
                    <p className="text-3xl text-[#2d3748]">₹{formatTotalSpend(summary.totalSpend)}</p>
                </div>
                <div className="bg-[#f0f2f5] p-5 rounded shadow-sm border-t-4 border-[#ed8936]">
                    <p className="text-sm font-semibold text-[#4a5568] mb-2">Avg Performance</p>
                    <p className="text-3xl text-[#2d3748]">{getAvgPerformance()}%</p>
                </div>
                <div className="bg-[#f0f2f5] p-5 rounded shadow-sm border-t-4 border-[#9f7aea]">
                    <p className="text-sm font-semibold text-[#4a5568] mb-2">Pending Orders</p>
                    <p className="text-3xl text-[#2d3748]">{getOpenOrders()}</p>
                </div>
            </div>

            {/* Add Vendor Section */}
            <div>
                <h3 className="text-lg font-bold text-[#2d3748] mb-3">Add Vendor</h3>
                <form onSubmit={handleAdd} className="bg-[#f0f2f5] p-6 rounded shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Vendor Name"
                            className="bg-[#e4e6ea] border border-transparent rounded px-4 py-2.5 focus:bg-white focus:outline-none transition-colors text-sm"
                            value={formData.vendorName}
                            onChange={e => setFormData({...formData, vendorName: e.target.value})}
                            required
                        />
                        <select 
                            className="bg-[#e4e6ea] border border-transparent rounded px-4 py-2.5 focus:bg-white focus:outline-none transition-colors appearance-none text-sm text-[#4a5568]"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="">Category</option>
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
                        <select 
                            className="bg-[#e4e6ea] border border-transparent rounded px-4 py-2.5 focus:bg-white focus:outline-none transition-colors appearance-none text-sm text-[#4a5568]"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Total Spend (example: ₹250K)"
                            className="bg-[#e4e6ea] border border-transparent rounded px-4 py-2.5 focus:bg-white focus:outline-none transition-colors text-sm"
                            value={formData.totalSpend}
                            onChange={e => setFormData({...formData, totalSpend: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Payment Terms"
                            className="bg-[#e4e6ea] border border-transparent rounded px-4 py-2.5 focus:bg-white focus:outline-none transition-colors text-sm"
                            value={formData.paymentTerms}
                            onChange={e => setFormData({...formData, paymentTerms: e.target.value})}
                        />
                        <input
                            type="date"
                            placeholder="Date of Order"
                            className="bg-[#e4e6ea] border border-transparent rounded px-4 py-2.5 focus:bg-white focus:outline-none transition-colors text-sm text-[#4a5568]"
                            value={formData.lastOrder}
                            onChange={e => setFormData({...formData, lastOrder: e.target.value})}
                        />
                        <button type="submit" className="bg-[#4a72d1] hover:bg-[#3b5998] text-white px-6 py-2.5 rounded font-medium text-sm transition-colors w-full cursor-pointer">
                            Add Vendor
                        </button>
                    </div>
                </form>
            </div>

            {/* Vendor Directory Section */}
            <div>
                <h3 className="text-lg font-bold text-[#2d3748] mb-3">Vendor Directory</h3>
                <div className="bg-[#f0f2f5] rounded shadow-sm overflow-hidden">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#dce1e8]">
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Vendor</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Category</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Status</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Spend</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Terms</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Date of Order</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dce1e8]">
                            {vendors.length === 0 ? (
                                <tr><td colSpan="7" className="px-5 py-8 text-center text-sm text-[#718096]">No vendors found.</td></tr>
                            ) : vendors.map((v) => {
                                const spend = getEffectiveSpend(v);
                                return (
                                <tr key={v.id} className="hover:bg-[#e8ebf0] transition-colors">
                                    <td className="px-5 py-4 text-sm text-[#4a72d1] font-medium">{v.vendorName || '-'}</td>
                                    <td className="px-5 py-4 text-sm text-[#4a5568]">{v.category || '-'}</td>
                                    <td className="px-5 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-[4px] text-xs font-semibold text-white ${
                                            v.status === 'Active' ? 'bg-[#5eab5e]' : 
                                            v.status === 'Pending' ? 'bg-[#ed8936]' : 'bg-[#c55b5b]'
                                        }`}>
                                            {v.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-[#4a5568]">{spend != null ? `₹${formatTotalSpend(spend)}` : '-'}</td>
                                    <td className="px-5 py-4 text-sm text-[#4a5568]">{v.companyName || '-'}</td>
                                    <td className="px-5 py-4 text-sm text-[#4a5568]">{v.contactPerson || '-'}</td>
                                    <td className="px-5 py-4 text-sm">
                                        <button 
                                            onClick={() => handleDelete(v.id)}
                                            className="bg-[#ba5454] hover:bg-[#a24949] text-white px-4 py-1.5 rounded-[4px] text-xs transition-colors shadow-sm cursor-pointer z-10 relative"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Analytics Graphs Section */}
            {(vendors.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#f0f2f5] p-6 rounded shadow-sm">
                        <h3 className="text-lg font-bold text-[#2d3748] mb-4">Spend by Category</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={spendByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dce1e8" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4a5568' }} angle={-25} textAnchor="end" height={50} />
                                    <YAxis tickFormatter={(val) => '₹' + formatTotalSpend(val)} tick={{ fontSize: 12, fill: '#4a5568' }} />
                                    <RechartsTooltip formatter={(val) => '₹' + formatTotalSpend(val)} contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} cursor={{fill: '#e4e6ea'}} />
                                    <Bar dataKey="spend" fill="#4a72d1" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-[#f0f2f5] p-6 rounded shadow-sm">
                        <h3 className="text-lg font-bold text-[#2d3748] mb-4">Vendor Status Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={vendorStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {vendorStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', color: '#4a5568' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
