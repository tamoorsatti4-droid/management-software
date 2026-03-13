import React, { useState, useEffect } from 'react';
import api from '../api';
import { ShoppingCart, CheckCircle, Trash2, Search, Hash, Percent, Printer, Receipt, Minus, Plus, Share2, X, Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function POS() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [autoPrint, setAutoPrint] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [showPostSale, setShowPostSale] = useState(false);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data)).catch(() => {
      // Demo products when API is unavailable
      setProducts([
        { id: 1, name: 'Cement (50kg)', selling_price: 1250, stock: 45, serial_number: 'CMT-001' },
        { id: 2, name: 'Steel Bars (Bundle)', selling_price: 8500, stock: 12, serial_number: 'STL-042' },
        { id: 3, name: 'Bricks (1000 pcs)', selling_price: 12000, stock: 8 },
        { id: 4, name: 'Sand (Truck)', selling_price: 15000, stock: 3 },
        { id: 5, name: 'Paint (Bucket)', selling_price: 4500, stock: 22, serial_number: 'PNT-108' },
        { id: 6, name: 'PVC Pipes (Bundle)', selling_price: 3200, stock: 0 },
        { id: 7, name: 'Electric Wire (Roll)', serial_number: 'ELC-102', selling_price: 2800, stock: 15 },
        { id: 8, name: 'Tiles (Box)', selling_price: 1800, stock: 30 },
      ]);
    });
  }, []);

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    const cartItemId = product.serial_number ? `${product.id}-${product.serial_number}` : product.id;
    const existing = cart.find(item => item.cartItemId === cartItemId);

    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCart(cart.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, {
        cartItemId,
        product_id: product.id,
        name: product.name,
        price: product.selling_price,
        quantity: 1,
        max_stock: product.stock,
        serial_number: product.serial_number
      }]);
    }
  };

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, qty) => {
    const q = parseInt(qty);
    if (q <= 0) return removeFromCart(cartItemId);
    setCart(cart.map(item => {
      if (item.cartItemId === cartItemId) {
        if (q > item.max_stock) return item;
        return { ...item, quantity: q };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const totalAmount = taxableAmount + taxAmount;

  const checkout = () => {
    if (cart.length === 0) return;
    const saleData = { items: [...cart], subtotal, discount, totalAmount, date: new Date().toLocaleString() };
    
    api.post('/sales', { items: cart, total_amount: totalAmount }).then(() => {
      setLastSale(saleData);
      setShowPostSale(true);
      if (autoPrint) handlePrint();
      setCart([]);
      setDiscount(0);
      setTaxRate(0);
      api.get('/products').then(res => setProducts(res.data)).catch(() => {});
    }).catch(() => {
      // Fallback for demo
      setLastSale(saleData);
      setShowPostSale(true);
      if (autoPrint) handlePrint();
      setCart([]);
      setDiscount(0);
      setTaxRate(0);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const shareWhatsApp = () => {
    const text = `Sale Receipt: Total PKR ${Math.round(totalAmount)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.serial_number && p.serial_number.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen lg:min-h-full bg-slate-50 dark:bg-slate-950 page-enter relative">
      {/* Post-Sale Actions Modal */}
      {showPostSale && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-800 scale-in relative overflow-hidden">
             {/* Sparkle decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
             
             <button onClick={() => setShowPostSale(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition">
                <X size={20} />
             </button>
             
             <div className="text-center">
               <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
                  <CheckCircle size={32} />
               </div>
               <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{lang === 'ur' ? 'فروخت مکمل!' : 'Sale Complete!'}</h2>
               <p className="text-slate-500 text-sm mb-6">{lang === 'ur' ? 'رسید کامیابی سے تیار کر لی گئی ہے۔' : `Receipt #${(Math.random() * 10000).toFixed(0)} has been generated.`}</p>
               
               <div className="space-y-3">
                  <button onClick={handlePrint} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 active:scale-95">
                    <Printer size={20} /> {t('printPDF')}
                  </button>
                  <button onClick={shareWhatsApp} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30 active:scale-95">
                    <Share2 size={20} /> {lang === 'ur' ? 'واٹس ایپ پر شیئر کریں' : 'Share on WhatsApp'}
                  </button>
                  <button onClick={() => setShowPostSale(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 transition active:scale-95">
                    {t('save')}
                  </button>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* Product Selection Area */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto no-print">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg">
              <ShoppingCart size={22} />
            </div>
            {t('pos')}
          </h1>
          
          <div className="flex items-center gap-3">
            {/* Auto Print Toggle */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:bg-slate-50 transition"
                 onClick={() => setAutoPrint(!autoPrint)}>
               <div className={`w-8 h-4 rounded-full relative transition-colors ${autoPrint ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${autoPrint ? 'translate-x-4' : ''}`}></div>
               </div>
               <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Printer size={12} /> {lang === 'ur' ? 'آٹو پرنٹ' : 'Auto-Print'}
               </span>
            </div>
          </div>
        </div>

        <div className="mt-4 mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 pl-11 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                p.stock > 0
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg active:scale-[0.97]'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="font-bold text-slate-800 dark:text-white text-sm truncate" title={p.name}>{p.name}</div>
              {p.serial_number && (
                <div className="inline-flex items-center text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded mt-1">
                  <Hash size={10} className="mr-0.5" /> {p.serial_number}
                </div>
              )}
              <div className="text-indigo-600 dark:text-indigo-400 font-extrabold mt-2 text-lg">PKR {p.selling_price.toLocaleString()}</div>
              <div className={`mt-1.5 text-xs font-semibold ${p.stock > 0 ? (p.stock <= 5 ? 'text-amber-500' : 'text-emerald-500') : 'text-rose-500'}`}>
                {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && <div className="col-span-full text-slate-500 dark:text-slate-400 mt-4 text-center text-sm">No products found.</div>}
        </div>
      </div>

      {/* Checkout Sidebar */}
      <div className="w-full lg:w-[400px] bg-white dark:bg-slate-900 lg:border-l border-t lg:border-t-0 border-slate-200 dark:border-slate-800 shadow-xl flex flex-col p-5 z-10 lg:h-full shrink-0">
        <h2 className="text-xl font-bold border-b border-slate-100 dark:border-slate-800 pb-3 text-slate-800 dark:text-white tracking-tight flex items-center gap-2 no-print">
          <Receipt size={20} className="text-indigo-500" /> {lang === 'ur' ? 'حالیہ آرڈر' : 'Current Order'}
        </h2>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 no-print">
          {cart.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center mt-8 text-sm">Cart is empty. Click products to add them.</p>}
          {cart.map(item => (
            <div key={item.cartItemId} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 group">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 dark:text-white text-sm truncate">{item.name}</div>
                {item.serial_number && (
                  <div className="text-[10px] text-slate-500 flex items-center mt-0.5">
                    <Hash size={8} className="mr-0.5" /> {item.serial_number}
                  </div>
                )}
                <div className="text-indigo-600 dark:text-indigo-400 font-medium text-xs mt-0.5">PKR {item.price.toLocaleString()} × {item.quantity}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.cartItemId, item.quantity - 1); }}
                  className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition text-xs">
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center font-bold text-sm text-slate-800 dark:text-white">{item.quantity}</span>
                <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.cartItemId, item.quantity + 1); }}
                  className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition text-xs">
                  <Plus size={12} />
                </button>
                <button onClick={() => removeFromCart(item.cartItemId)}
                  className="w-7 h-7 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center justify-center ml-1">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Discount & Tax */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 no-print">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="number"
                placeholder="Discount %"
                value={discount || ''}
                onChange={e => setDiscount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="number"
                placeholder="Tax %"
                value={taxRate || ''}
                onChange={e => setTaxRate(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 space-y-1.5">
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>{lang === 'ur' ? 'ذیلی کل' : 'Subtotal'}</span>
            <span>PKR {subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
              <span>{lang === 'ur' ? 'رعایت' : 'Discount'} ({discount}%)</span>
              <span>- PKR {discountAmount.toLocaleString()}</span>
            </div>
          )}
          {taxRate > 0 && (
            <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
              <span>{lang === 'ur' ? 'ٹیکس' : 'Tax'} ({taxRate}%)</span>
              <span>+ PKR {taxAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-2xl font-black text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
            <span>{lang === 'ur' ? 'کل رقم' : 'Total'}</span>
            <span className="text-indigo-600 dark:text-indigo-400">PKR {Math.round(totalAmount).toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 no-print">
          <button
            onClick={checkout}
            disabled={cart.length === 0}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3.5 font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} /> {lang === 'ur' ? 'فروخت مکمل کریں' : 'Complete Sale'}
          </button>
          <button
            onClick={handlePrint}
            disabled={cart.length === 0}
            className="w-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-40"
          >
            <Printer size={18} />
          </button>
        </div>

        {/* Print-only Bill */}
        <div className="print-only p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black">ManagerPro</h2>
            <p className="text-sm text-slate-500">Sales Receipt</p>
            <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleString()}</p>
          </div>
          <table className="w-full text-sm mb-4">
            <thead><tr className="border-b-2"><th className="text-left py-2">Item</th><th className="text-center">Qty</th><th className="text-right">Amount</th></tr></thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.cartItemId} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">PKR {(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t-2 pt-2 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>PKR {subtotal.toLocaleString()}</span></div>
            {discount > 0 && <div className="flex justify-between"><span>Discount ({discount}%)</span><span>-PKR {discountAmount.toLocaleString()}</span></div>}
            {taxRate > 0 && <div className="flex justify-between"><span>Tax ({taxRate}%)</span><span>+PKR {taxAmount.toLocaleString()}</span></div>}
            <div className="flex justify-between font-black text-lg border-t pt-2"><span>Total</span><span>PKR {Math.round(totalAmount).toLocaleString()}</span></div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}
