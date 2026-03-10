import React, { useState, useEffect } from 'react';
import api from '../api';
import { ShoppingCart, CheckCircle, Trash2, Search } from 'lucide-react';

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const addToCart = (product) => {
    if (product.stock <= 0) return alert("Out of stock!");
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return alert("Not enough stock!");
      setCart(cart.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product_id: product.id, name: product.name, price: product.selling_price, quantity: 1, max_stock: product.stock }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    const q = parseInt(qty);
    if (q <= 0) return removeFromCart(productId);
    setCart(cart.map(item => {
      if (item.product_id === productId) {
         if (q > item.max_stock) { alert("Exceeds available stock!"); return item; }
         return { ...item, quantity: q };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const checkout = () => {
    if (cart.length === 0) return;
    api.post('/sales', { items: cart, total_amount: totalAmount }).then(() => {
      alert("Sale successful!");
      setCart([]);
      api.get('/products').then(res => setProducts(res.data)); // Refresh stock
    }).catch(err => alert("Checkout failed."));
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen lg:min-h-full bg-slate-50 fade-in animate-in zoom-in-95 duration-500">
      {/* Product Selection Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center"><ShoppingCart className="mr-3 text-indigo-600" size={36} /> Point of Sale</h1>
        <div className="mt-6 mb-8 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search products..." 
            className="w-full max-w-xl border border-slate-200 rounded-2xl p-4 pl-12 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-lg transition-all" 
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => addToCart(p)} 
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${p.stock > 0 ? 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-lg active:scale-95' : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'}`}>
              <div className="font-bold text-slate-800 text-lg truncate" title={p.name}>{p.name}</div>
              <div className="text-indigo-600 font-extrabold mt-2 text-xl">PKR {p.selling_price.toLocaleString()}</div>
              <div className={`mt-2 text-sm font-medium ${p.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && <div className="col-span-full text-slate-500 mt-4 text-center">No products found matching your search.</div>}
        </div>
      </div>

      {/* Checkout Sidebar/Cart */}
      <div className="w-full lg:w-96 bg-white lg:border-l border-t lg:border-t-0 border-slate-200 shadow-xl flex flex-col p-6 z-10 lg:h-full shrink-0">
        <h2 className="text-2xl font-bold border-b border-slate-100 pb-4 text-slate-800 tracking-tight">Current Order</h2>
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cart.length === 0 && <p className="text-slate-500 text-center mt-10">Cart is empty.</p>}
          {cart.map(item => (
            <div key={item.product_id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex-1 overflow-hidden">
                <div className="font-bold text-slate-800 truncate pr-2" title={item.name}>{item.name}</div>
                <div className="text-indigo-600 font-medium text-sm">PKR {item.price} × {item.quantity}</div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <input type="number" className="w-14 border rounded-lg p-1 text-center font-bold outline-none" 
                  value={item.quantity} onChange={(e) => updateQuantity(item.product_id, e.target.value)} />
                <button onClick={() => removeFromCart(item.product_id)} className="text-rose-400 hover:text-rose-600 transition p-1.5 bg-white rounded-md shadow-sm border border-slate-100">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 pt-6 space-y-4 shrink-0">
          <div className="flex justify-between items-center text-lg text-slate-500 font-medium">
            <span>Subtotal</span>
            <span>PKR {totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-3xl font-black text-slate-900">
            <span>Total</span>
            <span className="text-indigo-600">PKR {totalAmount.toLocaleString()}</span>
          </div>
          <button onClick={checkout} disabled={cart.length === 0} 
            className="w-full bg-indigo-600 text-white rounded-2xl py-4 mt-4 font-bold text-lg hover:bg-indigo-700 hover:shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:shadow-none flex justify-center items-center">
            <CheckCircle className="mr-2" /> Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}
