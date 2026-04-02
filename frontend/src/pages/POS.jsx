import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Delete, X, Search, Filter, ShoppingBag, Tag, Package, Info } from 'lucide-react';
import { productsAPI, categoriesAPI, transactionsAPI } from '../services/api';

function POS({ dataVersion }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  useEffect(() => {
    fetchData();
  }, [dataVersion]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll({ limit: 100 }),
        categoriesAPI.getAll()
      ]);
      setProducts(productsRes.data.data.products || productsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching POS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? String(product.category_id) === String(selectedCategory) : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    const inCart = cart.find(i => i.product_id === product.id);
    setModalQty(inCart ? inCart.quantity : 1);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setModalQty(1);
  };

  const addToCart = (product, qty = 1) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    if (existingItem) {
      const newQty = qty;
      if (newQty > product.stock) {
        alert('Stok tidak mencukupi!');
        return;
      }
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: newQty }
          : item
      ));
    } else {
      if (qty > product.stock) {
        alert('Stok tidak mencukupi!');
        return;
      }
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        stock: product.stock,
        image: product.image
      }]);
    }
  };

  const handleModalAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, modalQty);
    closeProductModal();
  };

  const handleModalRemoveFromCart = () => {
    if (!selectedProduct) return;
    removeFromCart(selectedProduct.id);
    closeProductModal();
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity > item.stock) { alert('Stok maksimal tercapai'); return item; }
        if (newQuantity < 1) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const clearCart = () => {
    if (window.confirm('Kosongkan keranjang?')) {
      setCart([]);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      setProcessing(true);
      const transactionData = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        payment_method: paymentMethod
      };
      await transactionsAPI.create(transactionData);
      setCart([]);
      setShowPaymentModal(false);
      setShowCartModal(false);
      fetchData();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Transaksi gagal: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn max-w-7xl mx-auto space-y-8">
      {/* Top Bar: search + categories */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Cari nama produk atau SKU (Gunakan Barcode Scanner)..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-72 relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Plus size={14} className="rotate-45" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-bold">Menyiapkan Katalog Produk...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300">
              <ShoppingBag size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Produk Tidak Ditemukan</h3>
              <p className="text-slate-500 font-medium">Coba kata kunci lain atau pilih kategori berbeda</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map(product => {
              const inCart = cart.find(i => i.product_id === product.id);
              const outOfStock = product.stock <= 0;
              return (
                <div
                  key={product.id}
                  onClick={() => !outOfStock && openProductModal(product)}
                  className={`group relative bg-white border border-slate-100 rounded-3xl p-4 pb-14 shadow-sm transition-all duration-300 cursor-pointer
                    ${outOfStock ? 'opacity-60 cursor-not-allowed grayscale' : 'hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 hover:-translate-y-1 active:scale-95'}`}
                >
                  
                  <div className="aspect-square bg-slate-50 rounded-2xl mb-4 overflow-hidden relative flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                      />
                    ) : (
                      <div className="text-slate-200 font-black text-4xl">
                        {product.name.charAt(0)}
                      </div>
                    )}
                    {outOfStock && (
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                        <span className="bg-white px-4 py-2 rounded-xl text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-xl">HABIS</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-base font-black text-slate-900 tracking-tight">
                        Rp {product.price.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${product.stock < 5 ? 'text-amber-500' : 'text-slate-400'}`}>
                        Stok: {product.stock}
                      </span>
                    </div>

                  </div>

                  {/* Quantity control — absolute bottom, always aligned */}
                  {!outOfStock && (
                    <div
                      className="absolute bottom-3 left-3 right-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {inCart ? (
                        <div className="flex items-center w-full bg-slate-100 rounded-xl p-0.5">
                          <button
                            onClick={() => {
                              if (inCart.quantity <= 1) removeFromCart(product.id);
                              else updateQuantity(product.id, -1);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 hover:bg-red-50 hover:text-red-500 shadow-sm transition-all"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="flex-1 text-center font-black text-xs text-slate-900">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            disabled={inCart.quantity >= product.stock}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all disabled:opacity-40"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                          className="w-full h-8 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md hover:shadow-blue-200 active:scale-95 transition-all"
                        >
                          <Plus size={13} /> Tambah
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Cart Panel (Hidden until cart has items or clicked) */}
      <div className={`fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-4 transition-all duration-500 transform ${totalItems > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <button
          onClick={() => setShowCartModal(true)}
          className="flex items-center gap-4 bg-slate-900 text-white p-4 pl-6 rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="flex flex-col items-start mr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Belanja</span>
            <span className="text-lg font-black tracking-tight leading-none">Rp {Math.round(total).toLocaleString()}</span>
          </div>
          <div className="relative w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-[10px] font-black border-2 border-slate-900 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
        </button>
      </div>

      {/* Cart Drawer / Modal */}
      {showCartModal && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm animate-fadeIn flex justify-end"
          onClick={(e) => e.target === e.currentTarget && setShowCartModal(false)}
        >
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slideLeft">
            <div className="p-8 pb-6 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Keranjang</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{totalItems} Item terpilih</p>
                </div>
              </div>
              <button 
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                onClick={() => setShowCartModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 grayscale">
                  <div className="p-10 rounded-full bg-slate-100">
                    <ShoppingCart size={80} className="text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Kosong Melompong</h3>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product_id} className="group flex gap-4 p-4 rounded-3xl border border-slate-50 hover:border-blue-100 hover:bg-slate-50/50 transition-all">
                    <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-2xl overflow-hidden">
                      {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-slate-300 text-2xl">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-bold text-slate-900 truncate pr-6">{item.name}</h4>
                      <p className="text-sm font-black text-slate-900">Rp {(item.price).toLocaleString()}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 px-1.5 shadow-sm">
                          <button 
                            className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => updateQuantity(item.product_id, -1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-[2rem] text-center font-black text-xs">{item.quantity}</span>
                          <button 
                            className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => updateQuantity(item.product_id, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
              <div className="space-y-3 font-bold text-slate-600">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="text-slate-900">Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>PPN (11%)</span>
                  <span className="text-slate-900">Rp {Math.round(tax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-blue-600">Rp {Math.round(total).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  className="py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                >
                  <Delete size={18} /> Resikon
                </button>
                <button
                  className="py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                  disabled={cart.length === 0}
                  onClick={() => setShowPaymentModal(true)}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-bounceIn">
            <div className="p-8 flex items-center justify-between border-b border-slate-50">
              <h2 className="text-xl font-black text-slate-900">Metode Pembayaran</h2>
              <button 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                onClick={() => setShowPaymentModal(false)}
                disabled={processing}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="bg-blue-600 p-8 rounded-3xl text-white text-center shadow-xl shadow-blue-200 relative overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Total Bayar</p>
                  <h3 className="text-4xl font-black tracking-tight">Rp {Math.round(total).toLocaleString()}</h3>
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'cash', icon: Banknote, label: 'Tunai', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                  { id: 'credit_card', icon: CreditCard, label: 'Debit/QRIS', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all group
                      ${paymentMethod === method.id 
                        ? `${method.color} ring-4 ring-slate-50 border-current shadow-inner` 
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400'}`}
                  >
                    <method.icon size={32} className={`transition-transform group-hover:scale-110 ${paymentMethod === method.id ? 'animate-bounce' : ''}`} />
                    <span className="text-sm font-black uppercase tracking-wider">{method.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg shadow-xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                  onClick={handleCheckout}
                  disabled={processing}
                >
                  {processing ? (
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Selesaikan Pembayaran
                    </>
                  )}
                </button>
                <button
                  className="w-full py-4 bg-transparent text-slate-400 font-bold hover:text-slate-600 transition-all text-sm"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={processing}
                >
                  Ganti Pesanan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Product Detail Modal */}
      {selectedProduct && (() => {
        const inCart = cart.find(i => i.product_id === selectedProduct.id);
        const maxStock = selectedProduct.stock;
        return (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
            onClick={(e) => e.target === e.currentTarget && closeProductModal()}
          >
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-bounceIn">
              {/* Product Image */}
              <div className="relative w-full h-56 bg-slate-100">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-200 font-black text-7xl">
                      {selectedProduct.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Close button */}
                <button
                  onClick={closeProductModal}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-white transition-all shadow-md"
                >
                  <X size={18} />
                </button>
                {/* Stock badge */}
                <div className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md
                  ${maxStock < 5 ? 'bg-amber-500 text-white' : 'bg-white/90 backdrop-blur-sm text-slate-700'}`}>
                  Stok: {maxStock}
                </div>
                {inCart && (
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-md">
                    {inCart.quantity} di keranjang
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h2>
                  {selectedProduct.sku && (
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                      <Tag size={10} /> SKU: {selectedProduct.sku}
                    </p>
                  )}
                </div>

                {selectedProduct.description && (
                  <div className="flex gap-2 text-sm text-slate-500">
                    <Info size={14} className="shrink-0 mt-0.5 text-slate-400" />
                    <p className="leading-relaxed">{selectedProduct.description}</p>
                  </div>
                )}

                <div className="flex items-center justify-between py-3 border-t border-b border-slate-100">
                  <span className="text-2xl font-black text-slate-900">
                    Rp {selectedProduct.price.toLocaleString()}
                  </span>
                  {selectedProduct.category_name && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl flex items-center gap-1">
                      <Package size={11} />{selectedProduct.category_name}
                    </span>
                  )}
                </div>

                {/* Quantity Control */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">Jumlah</span>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-1">
                    <button
                      onClick={() => setModalQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:bg-white hover:shadow-sm transition-all disabled:opacity-30"
                      disabled={modalQty <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-black text-slate-900 text-lg">{modalQty}</span>
                    <button
                      onClick={() => setModalQty(q => Math.min(maxStock, q + 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:bg-white hover:shadow-sm transition-all disabled:opacity-30"
                      disabled={modalQty >= maxStock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Subtotal Preview */}
                <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-2xl">
                  <span className="text-sm font-bold text-blue-700">Subtotal</span>
                  <span className="font-black text-blue-700 text-lg">
                    Rp {(selectedProduct.price * modalQty).toLocaleString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-1">
                  {inCart && (
                    <button
                      onClick={handleModalRemoveFromCart}
                      className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={handleModalAddToCart}
                    className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingCart size={18} />
                    {inCart ? 'Perbarui Keranjang' : 'Tambah ke Keranjang'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default POS;
