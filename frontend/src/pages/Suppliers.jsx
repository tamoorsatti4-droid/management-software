import React, { useState, useEffect } from 'react';
import api from '../api';
import { Truck, Search, Plus, Phone, Mail, MapPin, Package, MoreVertical, Globe, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Suppliers() {
  const { t, lang, dir } = useLanguage();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    setLoading(true);
    api.get('/suppliers').then(res => {
      setSuppliers(res.data);
      setLoading(false);
    }).catch(() => {
      setSuppliers([
        { id: 1, name: 'DG Khan Cement', contact: 'Zafar Iqbal', phone: '042-111-222-333', email: 'sales@dgkhan.com', address: 'Dera Ghazi Khan', products: ['Cement'], rating: 'Preferred' },
        { id: 2, name: 'Pakistan Steel', contact: 'Irfan Aziz', phone: '021-333-444-555', email: 'info@paksteel.pk', address: 'Karachi, Pakistan', products: ['Steel Bars', 'Iron Sheets'], rating: 'Reliable' },
        { id: 3, name: 'Diamond Paints', contact: 'M. Ali', phone: '042-555-666-777', email: 'support@diamond.com', address: 'Lahore, Pakistan', products: ['Wall Paint', 'Enamel'], rating: 'Verified' },
        { id: 4, name: 'Lucky Cement', contact: 'Ahmed Khan', phone: '021-111-786-111', email: 'lucky@cement.com', address: 'Karachi', products: ['Cement', 'Concrete'], rating: 'Wholesale' },
      ]);
      setLoading(false);
    });
  };

  const filtered = suppliers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 page-enter ${lang === 'ur' ? 'font-urdu' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
              <Truck size={22} />
            </div>
            {t('suppliers')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your supply chain and raw material sources.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition shadow-lg shadow-amber-600/20 active:scale-95">
          <Plus size={18} /> {t('newSale')}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={16} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className={`w-full ${dir === 'rtl' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(supplier => (
          <div key={supplier.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Truck size={28} />
                  </div>
                  <div className={dir === 'rtl' ? 'text-right' : ''}>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{supplier.name}</h3>
                    <div className={`flex items-center gap-2 mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{supplier.rating}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-white transition"><MoreVertical size={20} /></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className={`flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <ShieldCheck size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div className={dir === 'rtl' ? 'text-right' : ''}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Point of Contact</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{supplier.contact}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div className={dir === 'rtl' ? 'text-right' : ''}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('phone')}</p>
                      <p className="font-medium">{supplier.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className={`flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div className={dir === 'rtl' ? 'text-right' : ''}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('email')}</p>
                      <p className="font-medium truncate max-w-[150px]">{supplier.email}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div className={dir === 'rtl' ? 'text-right' : ''}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('address')}</p>
                      <p className="font-medium">{supplier.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex flex-wrap gap-2 pt-5 border-t border-slate-50 dark:border-slate-800 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {supplier.products.map(prod => (
                  <span key={prod} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-700">
                    <Package size={12} /> {prod}
                  </span>
                ))}
                <button className={`${dir === 'rtl' ? 'mr-auto' : 'ml-auto'} flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline`}>
                  <Globe size={14} /> View Website
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="col-span-full py-10 text-center text-slate-500 italic">No suppliers found.</p>}
      </div>
    </div>
  );
}
