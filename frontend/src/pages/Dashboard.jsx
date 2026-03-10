import React, { useEffect, useState } from 'react';
import api from '../api';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({
    total_sales: 0,
    total_purchases: 0,
    total_expenses: 0,
    salaries_paid: 0,
    profit: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-xl font-semibold text-slate-500 animate-pulse">Loading Dashboard...</div>;

  const cards = [
    { label: 'Total Sales', value: data.total_sales, icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Purchases', value: data.total_purchases, icon: Package, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Miscellaneous Expenses', value: data.total_expenses, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Salaries Paid', value: data.salaries_paid, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-2">Your automated business operations summary.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-md cursor-default">
            <div className={`p-4 rounded-xl ${card.bg}`}>
              <card.icon size={28} className={card.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">PKR {card.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-indigo-100 font-medium text-lg">Net Profit / Loss</p>
            <h2 className="text-5xl font-black mt-2 tracking-tight">PKR {data.profit.toLocaleString()}</h2>
            <p className="mt-4 text-indigo-200 text-sm max-w-md">Automatically calculated based on total sales minus purchases, daily expenses, and employee salaries.</p>
          </div>
          <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-md">
            {data.profit >= 0 ? (
              <div className="flex items-center space-x-3 text-emerald-300">
                <TrendingUp size={48} />
                <span className="text-2xl font-bold">Trending Up</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-rose-300">
                <TrendingDown size={48} />
                <span className="text-2xl font-bold">Deficit</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
      </div>
    </div>
  );
}
