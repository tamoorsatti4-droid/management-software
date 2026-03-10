import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Receipt } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
    api.get('/expenses').then(res => setExpenses(res.data)).catch(console.error);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    api.post('/expenses', form).then(() => {
      setForm({ description: '', amount: '' });
      fetchExpenses();
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 fade-in animate-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Daily Expenses</h1>
        <p className="text-slate-500 mt-2">Record all your miscellaneous daily costs that will be deducted from profit.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
        
        {/* Form */}
        <div className="w-full md:w-1/3 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h2 className="text-lg font-bold mb-4 flex items-center text-slate-800"><Receipt className="mr-2 text-amber-500" /> New Expense</h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Description</label>
              <input type="text" placeholder="e.g. Electricity Bill, Tea, Repairs" required 
                className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Amount (PKR)</label>
              <input type="number" placeholder="0.00" required 
                className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
                value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-amber-500 text-white rounded-lg font-medium p-3 flex items-center justify-center hover:bg-amber-600 transition">
              <PlusCircle className="mr-2" /> Add Expense
            </button>
          </form>
        </div>

        {/* List */}
        <div className="w-full md:w-2/3">
          <h2 className="text-lg font-bold mb-4 text-slate-800">Recent Expenses</h2>
          <div className="space-y-3">
            {expenses.length === 0 && <p className="text-slate-500 italic">No expenses recorded yet.</p>}
            {expenses.map(exp => (
              <div key={exp.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition">
                <div>
                  <h4 className="font-bold text-slate-800">{exp.description}</h4>
                  <p className="text-xs text-slate-400 font-medium">{new Date(exp.date).toLocaleDateString()}</p>
                </div>
                <div className="text-lg font-black text-amber-600">PKR {exp.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
