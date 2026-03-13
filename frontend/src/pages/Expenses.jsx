import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Receipt, DollarSign, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const expenseCategories = ['Utilities', 'Maintenance', 'Transport', 'Food & Tea', 'Office Supplies', 'Miscellaneous'];

export default function Expenses() {
  const { t, lang, dir } = useLanguage();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Miscellaneous' });

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = () => {
    api.get('/expenses').then(res => setExpenses(res.data)).catch(() => {
      setExpenses([
        { id: 1, description: 'Electricity Bill', amount: 8500, date: '2026-03-12', category: 'Utilities' },
        { id: 2, description: 'Tea & Snacks', amount: 1200, date: '2026-03-12', category: 'Food & Tea' },
        { id: 3, description: 'Truck Fuel', amount: 5000, date: '2026-03-11', category: 'Transport' },
        { id: 4, description: 'Printer Paper', amount: 800, date: '2026-03-11', category: 'Office Supplies' },
        { id: 5, description: 'Plumbing Repair', amount: 3500, date: '2026-03-10', category: 'Maintenance' },
      ]);
    });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    api.post('/expenses', form).then(() => { setForm({ description: '', amount: '', category: 'Miscellaneous' }); fetchExpenses(); });
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const catColors = {
    'Utilities': 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
    'Maintenance': 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
    'Transport': 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400',
    'Food & Tea': 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400',
    'Office Supplies': 'bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400',
    'Miscellaneous': 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  };

  return (
    <div className={`p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 page-enter ${lang === 'ur' ? 'font-urdu' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg"><Receipt size={22} /></div>
            {t('expenses')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Record daily costs deducted from profit.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-center">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('amount')}</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">PKR {totalExpenses.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-96 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className={`text-lg font-bold mb-4 flex items-center text-slate-800 dark:text-white ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}><DollarSign className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-amber-500`} size={20} /> {t('addExpense')}</h2>
          <form onSubmit={handleAddExpense} className="space-y-3">
            <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">Description</label>
              <input type="text" placeholder="e.g. Electricity Bill" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">{t('amount')} (PKR)</label>
              <input type="number" placeholder="0" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
            <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">{t('category')}</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select></div>
            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium p-3 text-sm flex items-center justify-center hover:shadow-lg hover:shadow-amber-500/30 transition shadow-lg active:scale-95"><PlusCircle className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} size={16} /> {t('save')}</button>
          </form>
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Recent Expenses</h2>
          <div className="space-y-2">
            {expenses.length === 0 && <p className="text-slate-500 dark:text-slate-400 italic text-sm">No expenses recorded yet.</p>}
            {expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition">
                <div className={`flex items-center gap-3 flex-1 min-w-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0"><Receipt size={18} /></div>
                  <div className={`min-w-0 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{exp.description}</h4>
                    <div className={`flex items-center gap-2 mt-0.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Calendar size={10} /> {new Date(exp.date).toLocaleDateString()}</span>
                      {exp.category && <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${catColors[exp.category] || catColors['Miscellaneous']}`}>{exp.category}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400 shrink-0 mx-2">PKR {exp.amount?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
