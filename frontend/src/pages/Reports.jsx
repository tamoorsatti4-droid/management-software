import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  BarChart3, TrendingUp, Calendar, AlertCircle, Download,
  Printer, FileText, Table as TableIcon, Filter, ChevronDown,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Reports() {
  const { t, lang, dir } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodType, setPeriodType] = useState('daily'); // daily, weekly, monthly, yearly
  const [activeTab, setActiveTab] = useState('Overview'); // Overview, Sales, Profit, Expenses

  useEffect(() => {
    fetchReports();
  }, [periodType]);

  const fetchReports = () => {
    setLoading(true);
    api.get(`/reports?type=${periodType}`)
      .then(res => {
        setReports(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch reports", err);
        // Fallback for demo
        setReports([
          { period: '2026-03-12', sales: 45000, expenses: 12000, profit: 33000 },
          { period: '2026-03-11', sales: 38000, expenses: 8500, profit: 29500 },
          { period: '2026-03-10', sales: 42000, expenses: 15000, profit: 27000 },
          { period: '2026-03-09', sales: 31000, expenses: 9000, profit: 22000 },
          { period: '2026-03-08', sales: 28000, expenses: 7500, profit: 20500 },
        ]);
        setLoading(false);
      });
  };

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    const headers = ['Period', 'Sales', 'Expenses', 'Profit'];
    const csvContent = [
      headers.join(','),
      ...reports.map(r => `${r.period},${r.sales},${r.expenses},${r.profit || r.sales - r.expenses}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Report_${periodType}_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxVal = Math.max(...reports.map(r => Math.max(r.sales, r.expenses)), 1000);

  return (
    <div className={`p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 page-enter ${lang === 'ur' ? 'font-urdu' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 no-print">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <BarChart3 size={22} />
            </div>
            {t('analytics')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Exportable business performance breakdown.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
            <Printer size={16} /> {t('printPDF')}
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
            <Download size={16} /> {t('exportExcel')}
          </button>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm no-print">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {['daily', 'weekly', 'monthly', 'yearly'].map(type => (
            <button
              key={type}
              onClick={() => setPeriodType(type)}
              className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                periodType === type
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t(type)}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          {['Overview', 'Sales', 'Profit', 'Expenses'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold pb-1 border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Report Content */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 rounded-[2rem]">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="mt-4 text-slate-500 dark:text-slate-400 font-medium italic">Generating Report...</span>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p className="font-medium text-lg">No data matches your selection.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Visual Header */}
            <div className="flex items-center justify-between no-print">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Calendar className="text-indigo-500" size={24} />
                {t(periodType)} {t('profitSummary')}
              </h2>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> {t('totalSales')}</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500"></div> {t('totalExpenses')}</div>
              </div>
            </div>

            {/* List/Bars */}
            <div className="space-y-4">
              {reports.map((report, idx) => {
                const profit = report.profit || (report.sales - report.expenses);
                const isProfitable = profit >= 0;

                return (
                  <div key={idx} className="group transition-all duration-300 hover:translate-x-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          {report.period}
                        </span>
                        <div className={`flex items-center gap-1 text-xs font-bold ${isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isProfitable ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {t('netProfit')}: PKR {Math.abs(profit || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs font-bold">
                         <span className="text-emerald-500">{t('totalSales')}: PKR {(report.sales || 0).toLocaleString()}</span>
                         <span className="text-rose-500">{t('totalExpenses')}: PKR {(report.expenses || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-700 space-y-2 relative overflow-hidden">
                      <div className="flex items-center gap-3">
                        <div className={`w-16 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('revenue')}</div>
                        <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 animate-shimmer"
                            style={{ width: `${(report.sales / maxVal) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-16 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('cost')}</div>
                        <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-1000"
                            style={{ width: `${(report.expenses / maxVal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Print View Table (simplistic) */}
      <div className="hidden print:block space-y-6">
         <div className="text-center">
            <h1 className="text-2xl font-black">{t('analytics')}</h1>
            <p className="text-sm text-slate-500">{t(periodType).toUpperCase()} breakdown for {new Date().toLocaleDateString()}</p>
         </div>
         <table className={`w-full border-collapse border border-slate-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <thead>
              <tr className="bg-slate-50">
                <th className="border p-2">{t('period')}</th>
                <th className="border p-2">{t('totalSales')}</th>
                <th className="border p-2">{t('totalExpenses')}</th>
                <th className="border p-2">{t('netProfit')}</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i}>
                  <td className="border p-2">{r.period}</td>
                  <td className="border p-2 text-right">PKR {r.sales.toLocaleString()}</td>
                  <td className="border p-2 text-right">PKR {r.expenses.toLocaleString()}</td>
                  <td className="border p-2 text-right font-bold">PKR {(r.sales - r.expenses).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
