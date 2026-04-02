import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { UserPlus, X, Pencil, Eye, EyeOff, Shield, Mail, Lock, UserCheck, UserX, User, Search } from 'lucide-react';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'kasir',
    is_active: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    user.email?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    user.role?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setShowPassword(false);
    setFormData({ name: '', email: '', password: '', role: 'kasir', is_active: true });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowPassword(false);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      is_active: user.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const payload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          is_active: formData.is_active,
          ...(formData.password ? { password: formData.password } : {})
        };
        await usersAPI.update(editingUser.id, payload);
      } else {
        await usersAPI.create(formData);
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Gagal menyimpan pengguna: ' + (error.response?.data?.message || error.message));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setShowPassword(false);
  };

  const handleQuickActivate = async (user) => {
    try {
      const payload = {
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: true
      };
      await usersAPI.update(user.id, payload);
      fetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Gagal mengaktifkan pengguna: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-slate-500 font-bold">Mengakses Data Pengguna...</p>
    </div>
  );

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Pengguna</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">Kelola akses dan otoritas tim operasional toko</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 justify-end">
          <div className="relative group w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Cari nama, email..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-900 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm whitespace-nowrap"
          >
            <UserPlus size={18} />
            Tambah Kasir
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-20">Avatar</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Lengkap</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Hak Akses</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Terdaftar</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-slate-50/30 transition-colors group ${!user.is_active ? 'bg-red-50/10' : ''}`}>
                  <td className="px-6 py-3.5 text-center">
                    <div className="mx-auto w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm shadow-inner group-hover:scale-110 transition-transform">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{user.name}</span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 font-medium text-sm">{user.email}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                      ${user.role === 'admin' 
                        ? 'bg-amber-100 text-amber-600 border border-amber-200' 
                        : 'bg-blue-100 text-blue-600 border border-blue-200'}`}>
                      <Shield size={10} />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                      ${user.is_active 
                        ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' 
                        : 'bg-red-100 text-red-600 border border-red-200'}`}>
                      {user.is_active ? <UserCheck size={10} /> : <UserX size={10} />}
                      {user.is_active ? 'Aktif' : 'Menunggu Aktivasi'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right text-slate-400 font-bold text-xs">
                    {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {!user.is_active && (
                        <button
                          onClick={() => handleQuickActivate(user)}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all"
                        >
                          Aktifkan
                        </button>
                      )}
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={closeModal}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-bounceIn" onClick={e => e.stopPropagation()}>
            <div className="p-6 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                  {editingUser ? <Pencil size={18} /> : <UserPlus size={18} />}
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {editingUser ? 'Perbarui Profil' : 'Kasir Baru'}
                </h2>
              </div>
              <button 
                onClick={closeModal} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <div className="relative group">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-900 text-sm"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="nama@toko.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-900 text-sm"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password {editingUser && <span className="lowercase text-slate-300 font-medium">(opsional)</span>}
                </label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingUser}
                    placeholder={editingUser ? '••••••••' : 'Buat password aman'}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-900 text-sm"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Otoritas</label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-bold text-slate-900 text-sm appearance-none cursor-pointer"
                    >
                      <option value="kasir">Kasir</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>

                {editingUser && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Akun</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                      className={`w-full py-2.5 rounded-xl font-black text-xs transition-all border-2
                        ${formData.is_active 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                          : 'bg-red-50 border-red-100 text-red-600'}`}
                    >
                      {formData.is_active ? 'AKTIF' : 'NON-AKTIF'}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                >
                  {editingUser ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
