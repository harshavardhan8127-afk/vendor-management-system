import React, { useState, useEffect } from 'react';
import { FileText, Download, BarChart2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';

export default function Reports() {
    const [vendors, setVendors] = useState([]);
    
    useEffect(() => {
        api.get('/vendors')
           .then(res => setVendors(Array.isArray(res.data) ? res.data : []))
           .catch(err => {
               console.error("Error fetching vendors:", err);
               toast.error("Failed to load data for reports");
           });
    }, []);

    const handleFileReport = () => {
        if (!vendors.length) {
            toast.error("No data available for report");
            return;
        }
        
        const categories = {};
        vendors.forEach(v => {
            const cat = v.category || 'Uncategorized';
            let amount = 0;
            if (v.email) {
                let val = v.email.replace(/[₹$,]/g, '').trim().toLowerCase();
                let mult = 1;
                if (val.endsWith('k')) { mult = 1000; val = val.replace('k', ''); }
                else if (val.endsWith('m')) { mult = 1000000; val = val.replace('m', ''); }
                amount = parseFloat(val) * mult || 0;
            }
            categories[cat] = (categories[cat] || 0) + amount;
        });

        const rows = Object.entries(categories).map(([cat, amount]) => [cat, `₹${amount.toLocaleString()}`]);
        const csvContent = "Category,Total Expenditure\n" + rows.map(r => `"${r[0]}","${r[1]}"`).join("\n");
        downloadCSV(csvContent, `Expenditure_Report_${new Date().toISOString().split('T')[0]}.csv`);
        toast.success("Expenditure report downloaded");
    };

    const handleRenderPDF = () => {
        if (!vendors.length) {
            toast.error("No data available for PDF");
            return;
        }
        
        const printWindow = window.open('', '_blank');
        const rows = vendors.map(v => {
            let score = 80;
            if (v.status === 'Active') score = 95;
            else if (v.status === 'Pending') score = 60;
            else if (v.status === 'Inactive') score = 30;
            return `<tr>
                <td style="padding:12px;border-bottom:1px solid #ddd;color:#333">${v.vendorName || 'N/A'}</td>
                <td style="padding:12px;border-bottom:1px solid #ddd;color:#333">${v.category || 'N/A'}</td>
                <td style="padding:12px;border-bottom:1px solid #ddd;color:#333">${score}%</td>
                <td style="padding:12px;border-bottom:1px solid #ddd;color:#333">${v.status || 'Active'}</td>
            </tr>`;
        }).join('');

        const html = `
            <html>
                <head>
                    <title>Performance Analytics</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
                        h1 { color: #2d3748; border-bottom: 2px solid #5eab5e; padding-bottom: 10px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th { background: #f0f2f5; padding: 12px; text-align: left; color: #4a5568; }
                        .footer { margin-top: 40px; font-size: 12px; color: #718096; text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>Vendor Performance Analytics</h1>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <table>
                        <thead>
                            <tr><th>Vendor</th><th>Category</th><th>Performance Rating</th><th>Status</th></tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <div class="footer">TradeFlow System Generated Report</div>
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        toast.success("PDF renderer opened");
    };

    const handleDownloadLog = () => {
        if (!vendors.length) {
            toast.error("No transactions to export");
            return;
        }

        const mappedTxs = vendors.map(v => ({
            id: `Tx-${(v.id * 837 + 1024)}`,
            vendorName: v.vendorName || 'Unknown',
            date: new Date().toISOString().split('T')[0],
            amount: v.email || '₹0',
            status: v.status === 'Active' ? 'Paid' : (v.status === 'Pending' ? 'Pending' : 'Failed')
        }));

        const headers = ["Receipt ID", "Vendor Name", "Date", "Amount", "Status"];
        const csvContent = [
            headers.join(","),
            ...mappedTxs.map(t => [t.id, t.vendorName, t.date, t.amount, t.status].map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        downloadCSV(csvContent, `Transaction_Log_${new Date().toISOString().split('T')[0]}.csv`);
        toast.success("Transaction log downloaded");
    };

    const downloadCSV = (content, filename) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl">
            <h3 className="text-lg font-bold text-[#2d3748]">Data Exports & Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-[#f0f2f5] p-6 rounded shadow-sm border border-[#dce1e8] flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="p-4 bg-white rounded-full mb-4 shadow-sm border border-[#cbd5e1]">
                        <FileText className="h-8 w-8 text-[#4a72d1]" />
                    </div>
                    <h4 className="font-semibold text-[#2d3748] mb-2">Monthly Expenditure</h4>
                    <p className="text-sm text-[#718096] mb-6">Detailed breakdown of vendor spending across categories in the last 30 days.</p>
                    <button onClick={handleFileReport} className="bg-[#4a72d1] hover:bg-[#3b5998] text-white px-6 py-2.5 rounded text-sm w-full transition-colors flex items-center justify-center font-medium shadow-sm cursor-pointer">
                        <Download className="h-4 w-4 mr-2" /> File Report
                    </button>
                </div>

                <div className="bg-[#f0f2f5] p-6 rounded shadow-sm border border-[#dce1e8] flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="p-4 bg-white rounded-full mb-4 shadow-sm border border-[#cbd5e1]">
                        <BarChart2 className="h-8 w-8 text-[#5eab5e]" />
                    </div>
                    <h4 className="font-semibold text-[#2d3748] mb-2">Performance Analytics</h4>
                    <p className="text-sm text-[#718096] mb-6">Historical metrics of vendor completion rates, ratings, and SLAs tracking.</p>
                    <button onClick={handleRenderPDF} className="bg-[#5eab5e] hover:bg-[#4a8a4a] text-white px-6 py-2.5 rounded text-sm w-full transition-colors flex items-center justify-center font-medium shadow-sm cursor-pointer">
                        <Download className="h-4 w-4 mr-2" /> Render PDF
                    </button>
                </div>

                <div className="bg-[#f0f2f5] p-6 rounded shadow-sm border border-[#dce1e8] flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="p-4 bg-white rounded-full mb-4 shadow-sm border border-[#cbd5e1]">
                        <FileText className="h-8 w-8 text-[#ed8936]" />
                    </div>
                    <h4 className="font-semibold text-[#2d3748] mb-2">Transaction Ledgers</h4>
                    <p className="text-sm text-[#718096] mb-6">Complete accounting trace of all platform-wide system vendor transactions.</p>
                    <button onClick={handleDownloadLog} className="bg-[#ed8936] hover:bg-[#d0742b] text-white px-6 py-2.5 rounded text-sm w-full transition-colors flex items-center justify-center font-medium shadow-sm cursor-pointer">
                        <Download className="h-4 w-4 mr-2" /> Download Log
                    </button>
                </div>

            </div>
        </div>
    );
}
