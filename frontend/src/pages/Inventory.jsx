import React, { useState, useEffect } from 'react';
import api from '../api';
import { PackagePlus, Database, Plus, RefreshCw } from 'lucide-react';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', purchase_price: '', selling_price: '', stock: '' });
  const [restockData, setRestockData] = useState({ product_id: '', quantity: '', total_cost: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api.get('/products').then(res => setProducts(res.data)).catch(console.error);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    api.post('/products', newProduct).then(() => {
      setNewProduct({ name: '', purchase_price: '', selling_price: '', stock: '' });
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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Inventory & Purchases</h1>
          <p className="text-slate-500 mt-2">Manage your product catalog and record new stock shipments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit w-full">
          <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800"><PackagePlus className="mr-2 text-indigo-500" /> Register New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <input type="text" placeholder="Product Name" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
              value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="number" placeholder="Purchase Price (PKR)" required className="border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={newProduct.purchase_price} onChange={e => setNewProduct({...newProduct, purchase_price: e.target.value})} />
              <input type="number" placeholder="Selling Price (PKR)" required className="border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={newProduct.selling_price} onChange={e => setNewProduct({...newProduct, selling_price: e.target.value})} />
            </div>
            <input type="number" placeholder="Initial Stock Quantity" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
              value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
            <button type="submit" className="w-full bg-indigo-600 text-white rounded-xl font-medium p-3 flex items-center justify-center hover:bg-indigo-700 transition">
              <Plus className="mr-2" /> Add to Catalog
            </button>
          </form>
        </div>

        {/* Restock Form */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700 text-white h-fit w-full">
          <h2 className="text-xl font-bold mb-4 flex items-center"><RefreshCw className="mr-2 text-emerald-400" /> Restock Existing Item</h2>
          <form onSubmit={handleRestock} className="space-y-4">
            <select required className="w-full border border-slate-600 bg-slate-800 text-white rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={restockData.product_id} onChange={e => setRestockData({...restockData, product_id: e.target.value})}>
              <option value="">Select Product...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
            </select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="number" placeholder="Quantity Added" required className="border border-slate-600 bg-slate-800 text-white placeholder-slate-400 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={restockData.quantity} onChange={e => setRestockData({...restockData, quantity: e.target.value})} />
              <input type="number" placeholder="Total Cost (PKR)" required className="border border-slate-600 bg-slate-800 text-white placeholder-slate-400 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={restockData.total_cost} onChange={e => setRestockData({...restockData, total_cost: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-white rounded-xl font-medium p-3 flex items-center justify-center hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30">
              <RefreshCw className="mr-2" size={18} /> Record Purchase
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8 w-full">
        <h2 className="text-xl font-bold mb-6 flex items-center"><Database className="mr-2 text-slate-400" /> Current Stock</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-default">
              <div className="font-bold text-slate-800 text-lg truncate" title={p.name}>{p.name}</div>
              <div className="text-sm text-slate-500 mt-1">Cost: PKR {p.purchase_price} | Price: PKR {p.selling_price}</div>
              <div className={`mt-3 font-bold text-lg ${p.stock > 10 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {p.stock} in stock
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="text-slate-500 p-4 col-span-full">No products found. Start by adding to your catalog.</p>}
        </div>
      </div>
    </div>
  );
}
