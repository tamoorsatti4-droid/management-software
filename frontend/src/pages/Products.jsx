import React, { useState, useEffect } from 'react';
import api from '../api';
import { Package, Search, Filter, Plus, Hash, Tag, MoreVertical, LayoutGrid, List as ListIcon, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Products() {
  const { t, lang, dir } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products').then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => {
      setProducts([
        { id: 1, name: 'Cement (50kg)', purchase_price: 950, selling_price: 1250, stock: 45, category: 'Construction', status: 'In Stock' },
        { id: 2, name: 'Steel Bars', purchase_price: 6500, selling_price: 8500, stock: 3, category: 'Construction', status: 'Low Stock' },
        { id: 3, name: 'Bricks', purchase_price: 8000, selling_price: 12000, stock: 8, category: 'Construction', status: 'Low Stock' },
        { id: 4, name: 'Sand', purchase_price: 10000, selling_price: 15000, stock: 2, category: 'Construction', status: 'Critical' },
        { id: 5, name: 'Paint Bucket', purchase_price: 3000, selling_price: 4500, stock: 22, category: 'Paint', status: 'In Stock' },
        { id: 6, name: 'PVC Pipes', purchase_price: 2200, selling_price: 3200, stock: 15, category: 'Plumbing', status: 'In Stock' },
      ]);
      setLoading(false);
    });
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 page-enter ${lang === 'ur' ? 'font-urdu' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Package size={22} />
            </div>
            {t('products')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all products, pricing and inventory levels.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95">
          <Plus size={18} /> {t('newSale')}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={16} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className={`w-full ${dir === 'rtl' ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'} py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
               onClick={() => setViewMode('grid')}
               className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
              <LayoutGrid size={18} />
            </button>
            <button
               onClick={() => setViewMode('list')}
               className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
              <ListIcon size={18} />
            </button>
          </div>
          <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border-b-4 border-b-transparent hover:border-b-indigo-500">
              <div className="p-5">
                <div className={`flex justify-between items-start mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    p.status === 'Critical' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30' :
                    p.status === 'Low Stock' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30' :
                    'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'
                  }`}>
                    {p.status}
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 dark:hover:text-white transition"><MoreVertical size={16} /></button>
                </div>
                <h3 className={`font-bold text-slate-800 dark:text-white text-lg mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>{p.name}</h3>
                <div className={`flex items-center gap-2 mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Tag size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{p.category}</span>
                </div>
                <div className={`flex items-end justify-between border-t border-slate-50 dark:border-slate-800 pt-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('sellingPrice')}</p>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">PKR {p.selling_price.toLocaleString()}</p>
                  </div>
                  <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('inStock')}</p>
                    <p className="text-base font-bold text-slate-700 dark:text-slate-200">{p.stock} units</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                <th className="p-4 font-bold">{t('product')}</th>
                <th className="p-4 font-bold">{t('category')}</th>
                <th className="p-4 font-bold">{t('buyingPrice')}</th>
                <th className="p-4 font-bold">{t('sellingPrice')}</th>
                <th className="p-4 font-bold">{t('stockStatus')}</th>
                <th className={`p-4 font-bold ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4 font-bold text-slate-800 dark:text-white">{p.name}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500">{p.category}</span></td>
                  <td className="p-4 text-slate-500">PKR {p.purchase_price.toLocaleString()}</td>
                  <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">PKR {p.selling_price.toLocaleString()}</td>
                  <td className="p-4">
                     <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span className={`w-2 h-2 rounded-full ${p.stock <= 5 ? 'bg-rose-500' : p.stock <= 10 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span className="font-semibold">{p.stock} units</span>
                     </div>
                  </td>
                  <td className={`p-4 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}><button className="text-slate-400 hover:text-indigo-600 transition"><MoreVertical size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
