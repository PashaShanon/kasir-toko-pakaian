import { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import { BarChart3, TrendingUp, Calendar, DollarSign, Receipt, ShoppingBag, ArrowUpRight, Search } from 'lucide-react';

function SalesReports() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    today: { total: 0, count: 0 },
    month: { total: 0, count: 0 },
    allTime: { total: 0, productsSold: 0 },
    recent: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [summaryRes, statsRes] = await Promise.all([
        transactionsAPI.getReportsSummary(),
        transactionsAPI.getStats()
      ]);

      if (summaryRes.data.success && statsRes.data.success) {
        setStats({
          ...summaryRes.data.data,
          allTime: {
            total: statsRes.data.data.total_sales,
            productsSold: statsRes.data.data.products_sold
          }
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecent = stats.recent.filter(trx => 
    trx.transaction_code?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    trx.cashier?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-slate-500 font-bold">Menghitung Laporan Penjualan...</p>
    </div>
  );

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Laporan Penjualan</h1>
          <p className="text-slate-500 font-medium mt-1">Pantau performa bisnis dan pertumbuhan toko anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Sales */}
        <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <DollarSign size={24} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">HARI INI</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Penjualan Hari Ini</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rp {stats.today.total.toLocaleString('id-ID')}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2 text-slate-500">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
              <p className="text-[11px] font-bold">{stats.today.count} Transaksi</p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50" />
        </div>

        {/* This Month's Sales */}
        <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">BULAN INI</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Omzet Bulanan</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rp {stats.month.total.toLocaleString('id-ID')}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2 text-slate-500">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[11px] font-bold">{stats.month.count} Transaksi</p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-50" />
        </div>

        {/* Total All Time Sales */}
        <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">TOTAL</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Penjualan</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rp {stats.allTime.total.toLocaleString('id-ID')}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2 text-slate-500">
              <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
              <p className="text-[11px] font-bold">Seluruh Waktu</p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-50 rounded-full blur-2xl opacity-50" />
        </div>

        {/* Total Products Sold */}
        <div className="group bg-slate-900 p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/10 text-white rounded-xl">
                <ShoppingBag size={24} />
              </div>
              <span className="text-[10px] font-black text-white/50 tracking-widest uppercase">Volume</span>
            </div>
            <div className="space-y-1 mt-2">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">Produk Terjual</p>
              <h3 className="text-3xl font-black text-white tracking-tight leading-none italic">{stats.allTime.productsSold.toLocaleString()}</h3>
              <p className="text-slate-500 text-[10px] font-medium leading-relaxed mt-2 uppercase tracking-tighter">Unit terdistribusi</p>
            </div>
          </div>
          <BarChart3 className="absolute -bottom-4 -right-4 text-white/5 w-24 h-24 rotate-12" />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            Transaksi Terakhir
          </h3>
          <div className="flex items-center gap-4 flex-1 max-w-md justify-end">
            <div className="relative group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Cari kode transaksi, kasir..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ShoppingBag className="text-slate-200 hidden sm:block" size={24} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-10 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Kode Transaksi</th>
                <th className="px-10 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Kasir</th>
                <th className="px-10 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Total</th>
                <th className="px-10 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {filteredRecent.map((trx, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6 font-black text-blue-600">
                    <span className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/50">
                      {trx.transaction_code}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Receipt size={14} />
                      </div>
                      {trx.cashier}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-lg font-black text-slate-900 italic">
                    Rp {parseFloat(trx.total_amount).toLocaleString('id-ID')}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <p className="font-bold text-slate-900 text-sm">{new Date(trx.created_at).toLocaleDateString('id-ID')}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(trx.created_at).toLocaleTimeString('id-ID')}</p>
                  </td>
                </tr>
              ))}
              {filteredRecent.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                      <ShoppingBag size={64} />
                      <p className="text-2xl font-black text-slate-900">Belum Ada Transaksi</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalesReports;
