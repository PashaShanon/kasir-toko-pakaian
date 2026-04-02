import { useState, useEffect } from 'react';
import { FileText, Calendar, DollarSign, Search, Eye, X, Receipt, User, CreditCard, ChevronRight } from 'lucide-react';
import { transactionsAPI } from '../services/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll();
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(trx => 
    trx.transaction_code?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    trx.user_name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    trx.payment_method?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  const handleViewDetail = async (id) => {
    try {
      const response = await transactionsAPI.getById(id);
      if (response.data && response.data.success) {
        setSelectedTransaction(response.data.data);
        setShowDetail(true);
      }
    } catch (error) {
      console.error('Error viewing transaction:', error);
      alert('Gagal mengambil detail transaksi');
    }
  };

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Riwayat Transaksi</h1>
          <p className="text-slate-500 font-medium mt-1">Lacak dan kelola rekaman semua penjualan anda</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Cari kode transaksi, kasir..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 px-4 rounded-2xl border border-slate-100 shadow-sm min-w-[200px]">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Receipt size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
              <p className="text-lg font-black text-slate-900 leading-none">{transactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Waktu</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Kode Transaksi</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Total Bayar</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Pembayaran</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Kasir</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                      <p className="text-slate-500 font-bold">Mengambil data transaksi...</p>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30 grayscale">
                      <div className="p-10 rounded-full bg-slate-50">
                        <Receipt size={60} />
                      </div>
                      <p className="text-2xl font-black text-slate-900">Belum ada transaksi tercatat</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{new Date(trx.created_at).toLocaleDateString('id-ID')}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(trx.created_at).toLocaleTimeString('id-ID')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm border border-blue-100/50">
                        {trx.transaction_code || `TRX-${trx.id}`}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-slate-900 tracking-tight">
                        Rp {parseFloat(trx.total_amount).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-lg shadow-slate-200">
                        {trx.payment_method}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                          <User size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-600">{trx.user_name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                        onClick={() => handleViewDetail(trx.id)}
                      >
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && selectedTransaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-bounceIn flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Receipt size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Detail Transaksi</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedTransaction.transaction_code || `TRX-${selectedTransaction.id}`}</p>
                </div>
              </div>
              <button 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                onClick={() => setShowDetail(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50/80 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Waktu</span>
                  <p className="font-bold text-slate-900 text-xs">{new Date(selectedTransaction.created_at).toLocaleString('id-ID')}</p>
                </div>
                <div className="space-y-1 text-center border-l border-slate-200">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Metode</span>
                  <p className="font-black text-blue-600 text-xs">{selectedTransaction.payment_method}</p>
                </div>
                <div className="space-y-1 text-center border-l border-slate-200">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kasir</span>
                  <p className="font-bold text-slate-900 text-xs">{selectedTransaction.user_name || '-'}</p>
                </div>
                <div className="space-y-1 text-right border-l border-slate-200">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  <p className="font-black text-emerald-500 text-xs uppercase">Berhasil</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full" />
                  Item Pembelian
                </h3>
                <div className="overflow-hidden border border-slate-100 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Produk</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Harga</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {selectedTransaction.items?.map((item, idx) => (
                        <tr key={idx} className="group">
                          <td className="px-5 py-3 font-bold text-slate-900 text-xs">{item.product_name}</td>
                          <td className="px-5 py-3 text-center font-black text-slate-400 text-xs">×{item.quantity}</td>
                          <td className="px-5 py-3 text-right text-slate-600 font-medium text-xs">Rp {parseFloat(item.price).toLocaleString()}</td>
                          <td className="px-5 py-3 text-right font-black text-slate-900 text-xs">Rp {(item.quantity * item.price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-slate-900 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] space-y-4">
              <div className="flex flex-col gap-1.5 font-medium text-slate-400">
                <div className="flex justify-between text-[11px]">
                  <span>Subtotal</span>
                  <span className="text-white">Rp {(parseFloat(selectedTransaction.total_amount) / 1.11).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>PPN (11%)</span>
                  <span className="text-white">Rp {(parseFloat(selectedTransaction.total_amount) * (0.11 / 1.11)).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
              <div className="w-full h-px bg-slate-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Bayar</p>
                  <p className="text-2xl font-black tracking-tight">Rp {parseFloat(selectedTransaction.total_amount).toLocaleString('id-ID')}</p>
                </div>
                <button 
                  className="px-6 py-3 bg-blue-600 hover:bg-white hover:text-slate-900 text-white rounded-xl font-black transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-sm"
                  onClick={() => window.print()}
                >
                  Cetak Struk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
