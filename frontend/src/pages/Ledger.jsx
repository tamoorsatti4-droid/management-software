import React, { useState } from 'react';
import { Search, UserPlus, CreditCard, ArrowUpRight, ArrowDownRight, Printer, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const mockLedger = [
  { id: 1, name: 'Tamoors Satti', phone: '0312-XXXXXXX', balance: 45000, limit: 100000, status: 'Active' },
  { id: 2, name: 'Hafiz Ahmed', phone: '0300-XXXXXXX', balance: 12000, limit: 50000, status: 'Active' },
  { id: 3, name: 'Kamal Khan', phone: '0321-XXXXXXX', balance: 85000, limit: 150000, status: 'Warning' },
  { id: 4, name: 'Rana Ali', phone: '0345-XXXXXXX', balance: 5000, limit: 10000, status: 'Active' },
];

export default function Ledger() {
  const { t, lang } = useLanguage();
  const [customers, setCustomers] = useState(mockLedger);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
              <CreditCard size={22} />
            </div>
            {lang === 'ur' ? 'کسٹمر لیجر (کھاتہ)' : 'Customer Credit Ledger'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage receivables and credit limits.</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 flex items-center gap-2">
          <UserPlus size={18} /> Add New Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Receivables', value: 147000, color: 'text-rose-600' },
          { label: 'High Risk', value: 85000, color: 'text-amber-600' },
          { label: 'Resolved This Month', value: 32000, color: 'text-emerald-600' },
          { label: 'Active Khata', value: 4, color: 'text-indigo-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
            <h3 className={`text-2xl font-black mt-1 ${stat.color}`}>PKR {stat.value.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Pending Balance</th>
                <th className="px-6 py-4">Credit Limit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {customers.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-white">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-rose-600">PKR {c.balance.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-500">PKR {c.limit.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full ${c.status === 'Warning' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-slate-400 hover:text-indigo-600 transition"><Printer size={16} /></button>
                       <button className="p-2 text-slate-400 hover:text-emerald-600 transition"><Share2 size={16} /></button>
                       <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">Details</button>
                    </div>
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
