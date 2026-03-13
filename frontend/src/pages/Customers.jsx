import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, Search, Plus, Mail, Phone, MapPin, MoreVertical, Star, Calendar, ShoppingBag } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setLoading(true);
    api.get('/customers').then(res => {
      setCustomers(res.data);
      setLoading(false);
    }).catch(() => {
      setCustomers([
        { id: 1, name: 'Taimoor Ahmed', email: 'taimoor@example.com', phone: '0300-1234567', total_spent: 125000, last_visit: '2026-03-10', rating: 5, credit_limit: 50000 },
        { id: 2, name: 'Sajid Mehmood', email: 'sajid@mail.com', phone: '0312-9876543', total_spent: 45000, last_visit: '2026-03-08', rating: 4, credit_limit: 15000 },
        { id: 3, name: 'Umar Hayat', email: 'umar@outlook.com', phone: '0345-4443322', total_spent: 89000, last_visit: '2026-03-12', rating: 5, credit_limit: 100000 },
        { id: 4, name: 'Ali Raza', email: 'ali.raza@gmail.com', phone: '0321-1112233', total_spent: 12000, last_visit: '2026-03-05', rating: 3, credit_limit: 5000 },
      ]);
      setLoading(false);
    });
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Users size={22} />
            </div>
            Customer Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Keep track of your client relationships and loyalty.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
          <Plus size={18} /> Add New Customer
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(customer => (
          <div key={customer.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-black">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">{customer.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < customer.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'} />
                    ))}
                  </div>
                </div>
              </div>
              <button className="text-slate-300 hover:text-slate-600 dark:hover:text-white transition"><MoreVertical size={20} /></button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Mail size={16} className="text-slate-400" /> {customer.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Phone size={16} className="text-slate-400" /> {customer.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Calendar size={16} className="text-slate-400" /> Last visit: {customer.last_visit}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Credit Limit</span>
                <span className="text-base font-black text-rose-500 dark:text-rose-400">PKR {customer.credit_limit.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Total Spent</span>
                <span className="text-lg font-black text-blue-600 dark:text-blue-400">PKR {customer.total_spent.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="col-span-full py-10 text-center text-slate-500 italic">No customers found.</p>}
      </div>
    </div>
  );
}
