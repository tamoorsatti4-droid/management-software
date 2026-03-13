import React, { useState, useEffect } from 'react';
import api from '../api';
import { PackagePlus, Database, Plus, RefreshCw, Hash, Search, AlertTriangle, Filter, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const categories = ['All', 'Construction', 'Electrical', 'Plumbing', 'Paint', 'Hardware', 'Other'];

export default function Inventory() {
  const { t, lang, dir } = useLanguage();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', purchase_price: '', selling_price: '', stock: '', serial_number: '', category: 'Other', supplier: '' });
  const [restockData, setRestockData] = useState({ product_id: '', quantity: '', total_cost: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api.get('/products').then(res => setProducts(res.data)).catch(() => {
      // Demo data
      setProducts([
        { id: 1, name: 'Cement (50kg)', purchase_price: 950, selling_price: 1250, stock: 45, serial_number: 'CMT-001', category: 'Construction', supplier: 'DG Khan Cement' },
        { id: 2, name: 'Steel Bars', purchase_price: 6500, selling_price: 8500, stock: 3, serial_number: 'STL-042', category: 'Construction', supplier: 'Pakistan Steel' },
        { id: 3, name: 'Bricks', purchase_price: 8000, selling_price: 12000, stock: 8, category: 'Construction' },
        { id: 4, name: 'Sand', purchase_price: 10000, selling_price: 15000, stock: 2, category: 'Construction' },
        { id: 5, name: 'Paint Bucket', purchase_price: 3000, selling_price: 4500, stock: 22, serial_number: 'PNT-108', category: 'Paint', supplier: 'Diamond Paints' },
        { id: 6, name: 'PVC Pipes', purchase_price: 2200, selling_price: 3200, stock: 0, category: 'Plumbing' },
        { id: 7, name: 'Electric Wire', purchase_price: 1800, selling_price: 2800, stock: 15, category: 'Electrical', supplier: 'Pakistan Cables' },
        { id: 8, name: 'Tiles Box', purchase_price: 1200, selling_price: 1800, stock: 30, category: 'Construction' },
      ]);
    });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    api.post('/products', newProduct).then(() => {
      setNewProduct({ name: '', purchase_price: '', selling_price: '', stock: '', serial_number: '', category: 'Other', supplier: '' });
      fetchProducts();
    });
  };

  const handleRestock = (e) => {
    e.preventDefault();
    api.post('/purchases', restockData).then(() => {
      setRestockData({ product_id: '', quantity: '', total_cost: '' });
      fetchProducts();
      alert("Stock added successfully.");
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.serial_number && p.serial_number.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchesLowStock = !showLowStockOnly || p.stock <= 10;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const lowStockCount = products.filter(p => p.stock <= 10 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className={`p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 page-enter ${lang === 'ur' ? 'font-urdu' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
              <Database size={22} />
            </div>
            {t('inventory')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your product catalog and record stock shipments.</p>
        </div>
        <div className="flex gap-2">
          {lowStockCount > 0 && (
            <div className={`flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-3 py-2 rounded-xl text-[10px] font-black border border-amber-200 dark:border-amber-800 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <AlertTriangle size={14} /> {lowStockCount} {t('stockStatus')}
            </div>
          )}
          {outOfStockCount > 0 && (
            <div className={`flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 px-3 py-2 rounded-xl text-[10px] font-black border border-rose-200 dark:border-rose-800 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <AlertTriangle size={14} /> {outOfStockCount} {t('outOfStock')}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Add Product Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className={`text-lg font-bold mb-4 flex items-center text-slate-800 dark:text-white ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <PackagePlus className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-indigo-500`} size={20} /> Register New Product
          </h2>
          <form onSubmit={handleAddProduct} className="space-y-3">
            <input type="text" placeholder="Product Name" required
              className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${dir === 'rtl' ? 'text-right' : ''}`}
              value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Hash size={14} className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input type="text" placeholder={t('serialNumber')}
                  className={`w-full ${dir === 'rtl' ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'} bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none`}
                  value={newProduct.serial_number} onChange={e => setNewProduct({...newProduct, serial_number: e.target.value})} />
              </div>
              <select
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                className={`bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${dir === 'rtl' ? 'text-right' : ''}`}
              >
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder={t('buyingPrice')} required
                className={`bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${dir === 'rtl' ? 'text-right' : ''}`}
                value={newProduct.purchase_price} onChange={e => setNewProduct({...newProduct, purchase_price: e.target.value})} />
              <input type="number" placeholder={t('sellingPrice')} required
                className={`bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${dir === 'rtl' ? 'text-right' : ''}`}
                value={newProduct.selling_price} onChange={e => setNewProduct({...newProduct, selling_price: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Initial Stock"
                className={`bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${dir === 'rtl' ? 'text-right' : ''}`}
                value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
              <div className="relative">
                <Truck size={14} className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input type="text" placeholder="Supplier Name"
                  className={`w-full ${dir === 'rtl' ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'} bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none`}
                  value={newProduct.supplier} onChange={e => setNewProduct({...newProduct, supplier: e.target.value})} />
              </div>
            </div>

            <button type="submit" className={`w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium p-3 text-sm flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/30 transition shadow-lg active:scale-95 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Plus className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} size={16} /> {t('addProduct')}
            </button>
          </form>
        </div>

        {/* Restock Form */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-950 p-6 rounded-2xl shadow-lg border border-slate-700 text-white">
          <h2 className={`text-lg font-bold mb-4 flex items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <RefreshCw className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-emerald-400`} size={20} /> Restock Existing Item
          </h2>
          <form onSubmit={handleRestock} className="space-y-3">
            <select required className={`w-full border border-slate-600 bg-slate-700 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${dir === 'rtl' ? 'text-right' : ''}`}
              value={restockData.product_id} onChange={e => setRestockData({...restockData, product_id: e.target.value})}>
              <option value="">Select Product...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Quantity Added" required
                className={`border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${dir === 'rtl' ? 'text-right' : ''}`}
                value={restockData.quantity} onChange={e => setRestockData({...restockData, quantity: e.target.value})} />
              <input type="number" placeholder={`${t('amount')} (PKR)`} required
                className={`border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${dir === 'rtl' ? 'text-right' : ''}`}
                value={restockData.total_cost} onChange={e => setRestockData({...restockData, total_cost: e.target.value})} />
            </div>
            <button type="submit" className={`w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium p-3 text-sm flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/30 transition shadow-lg active:scale-95 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <RefreshCw className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} size={16} /> {t('save')}
            </button>
          </form>
        </div>
      </div>

      {/* Stock List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className={`text-lg font-bold flex items-center text-slate-800 dark:text-white ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Database className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-slate-400`} size={20} /> {t('inventory')} ({filteredProducts.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search size={14} className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} />
              <input type="text" placeholder={t('searchPlaceholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className={`w-44 ${dir === 'rtl' ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all`} />
            </div>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className={`text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={`text-xs font-medium px-3 py-2 rounded-lg border transition ${showLowStockOnly ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
              <Filter size={12} className="inline mr-1" /> {t('stockStatus')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map(p => (
            <div key={p.id} className={`p-4 border rounded-xl transition cursor-default relative overflow-hidden group ${
              p.stock === 0 ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800' :
              p.stock <= 5 ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' :
              p.stock <= 10 ? 'bg-amber-50/30 dark:bg-amber-950/10 border-slate-200 dark:border-slate-700' :
              'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-750'
            }`}>
              {p.stock <= 5 && p.stock > 0 && (
                <div className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded`}>LOW</div>
              )}
              {p.stock === 0 && (
                <div className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded`}>OUT</div>
              )}
              <div className={`font-bold text-slate-800 dark:text-white text-sm truncate ${dir === 'rtl' ? 'text-right' : ''}`} title={p.name}>{p.name}</div>
              <div className={`flex flex-wrap gap-1 mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {p.serial_number && (
                  <div className="inline-flex items-center text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                    <Hash size={10} className="mr-0.5" /> {p.serial_number}
                  </div>
                )}
                {p.category && (
                  <div className="inline-flex items-center text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                    {p.category}
                  </div>
                )}
              </div>
              <div className={`text-xs text-slate-500 dark:text-slate-400 mt-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('buyingPrice')}: PKR {p.purchase_price?.toLocaleString()} | {t('sellingPrice')}: PKR {p.selling_price?.toLocaleString()}</div>
              {p.supplier && (
                <div className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Truck size={10} /> {p.supplier}
                </div>
              )}
              <div className={`mt-2 font-black text-lg ${dir === 'rtl' ? 'text-right' : ''} ${
                p.stock === 0 ? 'text-rose-500' :
                p.stock <= 5 ? 'text-amber-500' :
                p.stock <= 10 ? 'text-amber-600' :
                'text-emerald-600 dark:text-emerald-400'
              }`}>
                {p.stock} {t('inStock')}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && <p className="text-slate-500 dark:text-slate-400 p-4 col-span-full text-center text-sm">No products match your filters.</p>}
        </div>
      </div>
    </div>
  );
}
