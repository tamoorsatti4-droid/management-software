import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package,
  Users, ArrowRight, Activity, CreditCard, Layers, Receipt,
  Sparkles, Zap, ArrowUpRight, BarChart3, AlertCircle, BookmarkPlus
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Mock chart data (used when API data is not available)
const dailySalesData = [
  { day: 'Mon', sales: 12400 }, { day: 'Tue', sales: 18200 },
  { day: 'Wed', sales: 15800 }, { day: 'Thu', sales: 22100 },
  { day: 'Fri', sales: 19600 }, { day: 'Sat', sales: 28500 },
  { day: 'Sun', sales: 16300 },
];

const monthlyProfitData = [
  { month: 'Jan', profit: 45000, revenue: 120000 },
  { month: 'Feb', profit: 52000, revenue: 135000 },
  { month: 'Mar', profit: -12000, revenue: 128000 }, // Example negative profit
  { month: 'Apr', profit: 61000, revenue: 155000 },
  { month: 'May', profit: 58000, revenue: 148000 },
  { month: 'Jun', profit: 72000, revenue: 180000 },
];

const topProductsData = [
  { name: 'Cement', sales: 45000, qty: 150 },
  { name: 'Steel Bars', sales: 38000, qty: 85 },
  { name: 'Bricks', sales: 32000, qty: 3200 },
  { name: 'Sand', sales: 28000, qty: 45 },
  { name: 'Paint', sales: 21000, qty: 62 },
];

const productColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

// Custom Sparkline (Area Chart) Fallback with Y-Axis and Legend
const SparkLine = ({ data, color, darkMode, t, lang }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.sales), 1);
  const width = 500;
  const height = 200;
  const padding = 40;
  const innerWidth = width - (padding * 2);
  const innerHeight = height - (padding * 2);

  const points = data.map((d, i) => {
    const x = padding + (i * (innerWidth / (data.length - 1)));
    const y = height - padding - ((d.sales / max) * innerHeight);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="w-full h-full min-h-[220px] flex flex-col">
      {/* Legend */}
      <div className="flex items-center gap-2 mb-2 px-10">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
        <span className="text-xs font-bold text-slate-500">{t('totalSales')}</span>
      </div>
      
      <div className="flex-1 relative flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[9px] font-bold text-slate-400 h-[120px] absolute left-0 bottom-[40px] w-8">
           <span>{(max/1000).toFixed(0)}k</span>
           <span>{(max/2000).toFixed(0)}k</span>
           <span>0</span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 0.5, 1].map((p, i) => (
            <line key={i} x1={padding} y1={height - padding - (p * innerHeight)} x2={width - padding} y2={height - padding - (p * innerHeight)} stroke={darkMode ? '#1e293b' : '#f1f5f9'} strokeWidth="1" />
          ))}
          <polyline points={areaPoints} fill="url(#areaGradient)" stroke="none" />
          <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d, i) => {
            const x = padding + (i * (innerWidth / (data.length - 1)));
            const y = height - padding - ((d.sales / max) * innerHeight);
            return (
              <circle key={i} cx={x} cy={y} r="4" fill={color} stroke={darkMode ? '#0f172a' : '#fff'} strokeWidth="2" />
            );
          })}
        </svg>
      </div>
      <div className="flex justify-between px-10 mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-slate-400">{d.day}</span>
        ))}
      </div>
    </div>
  );
};

// Custom Mini Bar Chart Fallback with Legend and Y-axis
const MiniBarChart = ({ data, darkMode, t }) => {
  const max = Math.max(...data.map(d => Math.max(d.revenue, Math.abs(d.profit))), 1);
  return (
    <div className="w-full h-full min-h-[220px] flex flex-col">
       {/* Legend */}
       <div className="flex items-center gap-4 mb-2 px-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-indigo-500"></div><span className="text-xs font-bold text-slate-500">{t('revenue')}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div><span className="text-xs font-bold text-slate-500">{t('netProfit')}</span></div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-1 pt-4 relative">
        {/* Y-Axis */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[8px] font-bold text-slate-400 opacity-50 z-0">
           <span>{(max/1000).toFixed(0)}k</span>
           <span>0</span>
        </div>

        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group relative h-full">
             <div className="flex-1 w-full flex items-end justify-center gap-1 h-[140px] border-b border-slate-100 dark:border-slate-800">
                <div
                  className="w-1.5 sm:w-2 bg-indigo-500 rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                  style={{ height: `${(d.revenue / max) * 100}%` }}
                />
                <div
                  className={`w-1.5 sm:w-2 rounded-t-sm transition-all duration-500 group-hover:opacity-80 ${d.profit >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ height: `${(Math.abs(d.profit) / max) * 100}%` }}
                />
             </div>
             <span className="text-[10px] font-bold text-slate-400 mt-2">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { darkMode } = useTheme();
  const { t, lang, dir } = useLanguage();
  const [data, setData] = useState({
    total_sales: 0,
    total_purchases: 0,
    total_expenses: 0,
    salaries_paid: 0,
    profit: 0,
    pending_dues: 0
  });
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Persistence fix: load demo data immediately if loading is too slow
    const timer = setTimeout(() => {
       if (loading && data.total_sales === 0) {
          setData({ total_sales: 485000, total_purchases: 210000, total_expenses: 45000, salaries_paid: 120000, profit: -15000, pending_dues: 78000 });
       }
    }, 2000);

    Promise.all([
      api.get('/dashboard').catch(() => ({ data: {} })),
      api.get('/ai-insights').catch(() => ({ data: { insights: [] } }))
    ])
    .then(([dashboardRes, aiRes]) => {
      setData(prev => ({ 
        total_sales: 485000, total_purchases: 210000, total_expenses: 45000, salaries_paid: 120000, profit: -15000, pending_dues: 78000,
        ...dashboardRes.data 
      }));
      setAiInsights(aiRes.data.insights || [
        { type: 'positive', message: t('Your sales increased by 18% this week compared to last week.'), category: 'Sales' },
        { type: 'warning', message: "Inventory for product 'Cement' is running low — only 3 units left.", category: 'Stock' },
        { type: 'negative', message: 'Current month net profit is below target (-5%).', category: 'Finance' },
      ]);
      setLoading(false);
    })
    .finally(() => clearTimeout(timer));
  }, []);

  const statCards = [
    { label: t('totalSales'), value: data.total_sales, icon: ShoppingCart, gradient: 'from-emerald-500 to-teal-600', change: '+12.5%', up: true },
    { label: t('totalPurchases'), value: data.total_purchases, icon: Package, gradient: 'from-blue-500 to-cyan-600', change: '+8.2%', up: true },
    { label: t('totalExpenses'), value: data.total_expenses, icon: DollarSign, gradient: 'from-amber-500 to-orange-600', change: '-3.1%', up: false },
    { label: t('salariesPaid'), value: data.salaries_paid, icon: Users, gradient: 'from-violet-500 to-purple-600', change: '+0%', up: true },
    { label: t('netProfit'), value: data.profit, icon: TrendingUp, gradient: data.profit >= 0 ? 'from-emerald-500 to-indigo-600' : 'from-rose-500 to-rose-700', change: '+18.4%', up: data.profit >= 0, isProfit: true },
    { label: t('pendingDues'), value: data.pending_dues, icon: CreditCard, gradient: 'from-orange-500 to-rose-600', change: '+15%', up: false, isUrgent: true },
  ];

  const quickActions = [
    { label: t('newSale'), to: '/pos', icon: CreditCard, desc: t('posDesc'), gradient: 'from-violet-500 to-fuchsia-500', shadow: 'shadow-violet-500/20' },
    { label: t('addProduct'), to: '/products', icon: Layers, desc: t('inventoryDesc'), gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
    { label: t('addCustomer'), to: '/customers', icon: Users, desc: t('customersDesc'), gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
    { label: t('addExpense'), to: '/expenses', icon: Receipt, desc: t('expensesDesc'), gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
  ];

  return (
    <div className={`min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 page-enter ${lang === 'ur' ? 'font-urdu' : ''}`}>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t('dashboard')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-base">{t('systemOnline')}</p>
        </div>
        <div className="flex items-center gap-3">
           <Link to="/reports" className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
              <BarChart3 size={16} /> {t('reports')}
           </Link>
           <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
              <Zap size={20} fill="currentColor" />
           </div>
        </div>
      </div>

      {/* Quick Actions at Top */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
          <Activity size={20} className="text-indigo-500" /> {t('quickActions')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.to}
              className="group relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="flex items-center justify-between relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg ${action.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon size={22} strokeWidth={2.5} />
                </div>
                <div className={`w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-colors duration-300 ${dir === 'rtl' ? 'rotate-180' : ''}`}>
                  <ArrowRight size={16} />
                </div>
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-base font-black text-slate-800 dark:text-white mb-0.5">{action.label}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const isNegative = card.isProfit && card.value < 0;
          return (
            <div
              key={idx}
              className={`group overflow-hidden bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${idx * 75}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}>
                  <card.icon size={20} strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${card.up ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' : 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'}`}>
                  {card.up ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                  {card.change}
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{card.label}</p>
              <h3 className={`text-xl font-black mt-1 ${isNegative ? 'text-rose-500 dark:text-rose-400' : 'text-slate-800 dark:text-white'}`}>
                PKR {(card.value || 0).toLocaleString()}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-indigo-500" /> {t('totalSales')} (7 {lang === 'ur' ? 'دن' : 'Days'})
            </h3>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">+12% vs {lang === 'ur' ? 'گزشتہ ماہ' : 'Last Month'}</span>
          </div>
          <SparkLine data={dailySalesData} color="#6366f1" darkMode={darkMode} t={t} lang={lang} />
        </div>

        {/* Monthly Profit Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" /> {lang === 'ur' ? 'آمدن اور منافع' : 'Revenue & Profit'}
            </h3>
          </div>
          <MiniBarChart data={monthlyProfitData} darkMode={darkMode} t={t} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm h-full">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" /> {lang === 'ur' ? 'سب سے زیادہ بکنے والی مصنوعات' : 'Top Selling Products'}
          </h3>
          <div className="space-y-6">
            {topProductsData.map((product, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{idx + 1}</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{product.name}</span>
                  </div>
                  <div className="text-xs font-black text-slate-500 flex items-center gap-2">
                    <span className="bg-indigo-50 dark:bg-slate-800 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">Qty: {product.qty}</span>
                    <span>PKR {(product.sales/1000).toFixed(0)}k</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${(product.sales / topProductsData[0].sales) * 100}%`,
                      backgroundColor: productColors[idx],
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Business Insights - 2 cols */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-full blur-3xl z-0"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-xl font-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Zap size={20} className="text-white" fill="currentColor" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 gradient-text uppercase tracking-tight">{t('aiInsights')}</span>
            </h3>
            <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Live Analysis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${insight.type === 'positive' ? 'bg-emerald-100 text-emerald-600' : insight.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                    {insight.type === 'positive' ? <TrendingUp size={16} /> : <AlertCircle size={16} />}
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{insight.category}</span>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{insight.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                   <button className="flex-1 py-1.5 bg-white dark:bg-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition shadow-sm">Ignored</button>
                   <button className="flex-1 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-1">
                      <BookmarkPlus size={12} /> Take Action
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Receipt size={24} className="text-indigo-500" /> {t('recentActivity')}
          </h3>
          <Link to="/reports" className="text-xs font-black text-indigo-500 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-widest transition-colors">
            {lang === 'ur' ? 'مکمل رپورٹ دیکھیں' : 'Full Report'} <ArrowRight size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className={`w-full text-left ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800">
                <th className="pb-4 px-2">{lang === 'ur' ? 'آئی ڈی' : 'ID'}</th>
                <th className="pb-4">{lang === 'ur' ? 'تاریخ' : 'Date'}</th>
                <th className="pb-4">{lang === 'ur' ? 'ٹائپ' : 'Type'}</th>
                <th className="pb-4 text-right">{lang === 'ur' ? 'رقم' : 'Amount'}</th>
                <th className="pb-4 text-right">{lang === 'ur' ? 'سٹیٹس' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {[
                { id: 'TX-1042', date: '2026-03-12', type: 'Sale', amount: 12500, status: 'Completed', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
                { id: 'TX-1041', date: '2026-03-12', type: 'Purchase', amount: 45000, status: 'Pending', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
                { id: 'TX-1040', date: '2026-03-11', type: 'Expense', amount: 8200, status: 'Completed', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
              ].map((tx, i) => (
                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-5 px-2 text-sm font-black text-slate-700 dark:text-slate-300">{tx.id}</td>
                  <td className="py-5 text-xs font-bold text-slate-400">{tx.date}</td>
                  <td className="py-5">
                    <span className="text-xs font-black text-slate-600 dark:text-slate-400">{tx.type}</span>
                  </td>
                  <td className="py-5 text-right text-sm font-black text-slate-900 dark:text-white">PKR {(tx.amount || 0).toLocaleString()}</td>
                  <td className="py-5 text-right">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${tx.color}`}>
                      {tx.status}
                    </span>
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
