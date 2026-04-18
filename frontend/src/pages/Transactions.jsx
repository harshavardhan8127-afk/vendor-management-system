import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'sonner';
import { Edit2, Check, X } from 'lucide-react';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editStatus, setEditStatus] = useState('');
    
    useEffect(() => {
        api.get('/vendors')
           .then(res => {
               const rawVendors = Array.isArray(res.data) ? res.data : [];
               const mappedTxs = rawVendors.map(v => ({
                   id: v.id * 837 + 1024,
                   vendorDbId: v.id,
                   vendorName: v.vendorName || 'Unknown Vendor',
                   transactionDate: new Date().toISOString().split('T')[0],
                   transactionType: v.category === 'Services' ? 'Service Invoice' : 'Supply Purchase',
                   amount: v.totalSpend != null ? `₹${v.totalSpend}` : (v.email || '₹0'),
                   paymentStatus: v.status === 'Active' ? 'Paid' : (v.status === 'Pending' ? 'Pending' : 'Failed')
               }));
               setTransactions(mappedTxs);
           })
           .catch(console.error);
    }, []);

    const handleSaveStatus = async (tx) => {
        try {
            const newVendorStatus = editStatus === 'Paid' ? 'Active' : 'Pending';
            const res = await api.get(`/vendors/${tx.vendorDbId}`);
            const vendor = res.data;
            vendor.status = newVendorStatus;
            await api.put(`/vendors/${tx.vendorDbId}`, vendor);
            
            setTransactions(transactions.map(t => 
                t.id === tx.id ? { ...t, paymentStatus: editStatus } : t
            ));
            setEditingId(null);
            toast.success("Transaction status updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update transaction status");
        }
    };

    const handleExport = () => {
        if (transactions.length === 0) {
            toast.error("No transactions to export");
            return;
        }

        const headers = ["Receipt ID", "Vendor Name", "Date", "Type", "Amount", "Status"];
        const rows = transactions.map(t => [
            `Tx-${t.id}`,
            t.vendorName,
            t.transactionDate,
            t.transactionType,
            t.amount,
            t.paymentStatus || 'Pending'
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `Transactions_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Transactions exported successfully");
        }
    };

    return (
        <div className="space-y-8 max-w-6xl">
            <div>
                <h3 className="text-lg font-bold text-[#2d3748] mb-3">Transaction Configurations</h3>
                <div className="bg-[#f0f2f5] rounded shadow-sm overflow-hidden border-t-4 border-[#4a72d1]">
                    <div className="p-4 border-b border-[#cbd5e1] flex justify-between items-center bg-transparent">
                        <input
                            type="text"
                            placeholder="Filter transactions by ID or Vendor..."
                            className="bg-white border border-[#cbd5e1] rounded px-4 py-2 focus:bg-white focus:border-[#4a72d1] focus:outline-none transition-colors text-sm w-96"
                        />
                        <button onClick={handleExport} className="bg-[#5eab5e] hover:bg-[#4a8a4a] text-white px-4 py-2 rounded text-sm transition-colors shadow-sm cursor-pointer border border-[#4a8a4a]">
                            Export Excel
                        </button>
                    </div>
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#dce1e8]">
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Receipt ID</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Vendor Name</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Date</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Type</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Amount</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Status</th>
                                <th className="px-5 py-4 text-sm font-semibold text-[#4a5568]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dce1e8] bg-[#f0f2f5]">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center text-sm text-[#718096]">
                                        Database contains zero recorded transactions.
                                    </td>
                                </tr>
                            ) : transactions.map(t => (
                                <tr key={t.id} className="hover:bg-[#e8ebf0] transition-colors">
                                    <td className="px-5 py-4 text-sm text-[#4a5568] font-medium">Tx-{t.id}</td>
                                    <td className="px-5 py-4 text-sm text-[#4a72d1]">{t.vendorName}</td>
                                    <td className="px-5 py-4 text-sm text-[#4a5568]">{t.transactionDate}</td>
                                    <td className="px-5 py-4 text-sm text-[#4a5568]">{t.transactionType}</td>
                                    <td className="px-5 py-4 text-sm text-[#4a5568] font-medium">{t.amount}</td>
                                    <td className="px-5 py-4 text-sm">
                                        {editingId === t.id ? (
                                            <select 
                                                className="border border-[#cbd5e1] rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-[#4a72d1]"
                                                value={editStatus}
                                                onChange={(e) => setEditStatus(e.target.value)}
                                            >
                                                <option value="Paid">Paid</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-[4px] text-xs font-semibold text-white ${
                                                t.paymentStatus === 'Paid' ? 'bg-[#5eab5e]' : 
                                                t.paymentStatus === 'Pending' ? 'bg-[#ed8936]' : 'bg-[#c55b5b]'
                                            }`}>
                                                {t.paymentStatus || 'Pending'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        {editingId === t.id ? (
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleSaveStatus(t)} className="text-emerald-600 hover:text-emerald-800 p-1 bg-emerald-50 rounded cursor-pointer transition-colors shadow-sm"><Check className="h-4 w-4" /></button>
                                                <button onClick={() => setEditingId(null)} className="text-rose-600 hover:text-rose-800 p-1 bg-rose-50 rounded cursor-pointer transition-colors shadow-sm"><X className="h-4 w-4" /></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => { setEditingId(t.id); setEditStatus(t.paymentStatus === 'Paid' ? 'Paid' : 'Pending'); }} className="text-indigo-600 hover:text-indigo-800 p-1 bg-indigo-50 rounded bg-opacity-50 hover:bg-opacity-100 transition-colors cursor-pointer shadow-sm">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
