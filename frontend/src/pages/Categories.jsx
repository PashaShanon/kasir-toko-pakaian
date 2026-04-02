import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Tag, Search } from 'lucide-react';
import { categoriesAPI } from '../services/api';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    cat.description?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Gagal menyimpan kategori: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus kategori ini?')) return;
    try {
      await categoriesAPI.delete(id);
      fetchCategories();
    } catch (error) {
      if (error.response?.data?.code === 'CATEGORY_HAS_PRODUCTS') {
        const confirmCascade = window.confirm(
          'Kategori ini masih memiliki produk.\n\nAPAKAH ANDA YAKIN ingin menghapus kategori ini BESERTA SEMUA PRODUK di dalamnya?\n(Tindakan ini tidak dapat dibatalkan)'
        );
        if (confirmCascade) {
          try {
            await categoriesAPI.delete(id, true);
            fetchCategories();
          } catch (innerError) {
            alert('Gagal menghapus kategori: ' + (innerError.response?.data?.message || 'Terjadi kesalahan'));
          }
        }
      } else {
        alert('Gagal menghapus kategori: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
  };

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manajemen Kategori</h1>
          <p className="text-slate-500 font-medium mt-1">Atur label dan pengelompokan produk Anda</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Cari kategori..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
            onClick={() => { resetForm(); setShowModal(true); }}
          >
            <Plus size={20} />
            Tambah Kategori
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-bold">Memuat Kategori...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                <Tag size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Belum Ada Kategori</h3>
                <p className="text-slate-500 text-sm mt-1">Mulai dengan menambahkan kategori baru untuk produk Anda</p>
              </div>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id} className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                    <Tag size={28} />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                  <p className="text-slate-500 font-medium text-sm mt-2 line-clamp-2 leading-relaxed">
                    {category.description || 'Tidak ada deskripsi untuk kategori ini.'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-bounceIn">
            <div className="p-8 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Tag size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
                </h2>
              </div>
              <button 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Makanan, Minuman, Elektronik"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Deskripsi</label>
                <textarea
                  rows="3"
                  placeholder="Tuliskan sedikit penjelasan tentang kategori ini..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
