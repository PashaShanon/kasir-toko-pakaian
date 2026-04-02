import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X,
  Image as ImageIcon,
  Filter,
  AlertCircle,
} from "lucide-react";
import { productsAPI, categoriesAPI } from "../services/api";

function Products({ onDataChange }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    stock: "",
    sku: "",
    size: "",
    color: "",
    image: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category_id = selectedCategory;

      const response = await productsAPI.getAll(params);
      setProducts(response.data.data.products || response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category_id),
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data);
      } else {
        await productsAPI.create(data);
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(
        "Gagal menyimpan produk: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      category_id: product.category_id,
      price: product.price,
      stock: product.stock,
      sku: product.sku || "",
      size: product.size || "",
      color: product.color || "",
      image: product.image || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?"))
      return;

    try {
      await productsAPI.delete(id);
      fetchProducts();
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(
        "Gagal menghapus produk: " +
          (error.response?.data?.message || "Terjadi kesalahan pada server"),
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category_id: "",
      price: "",
      stock: "",
      sku: "",
      size: "",
      color: "",
      image: "",
    });
    setEditingProduct(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Produk
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Kelola katalog produk pakaian Anda
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
          onClick={handleAddNew}
        >
          <Plus size={20} />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama atau SKU..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative group min-w-[200px]">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Plus size={14} className="rotate-45" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-bold">Memuat data produk...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                <Package size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Belum ada produk
                </h3>
                <p className="text-slate-500 font-medium">
                  Mulai tambahkan produk untuk melihatnya di sini
                </p>
              </div>
              <button
                className="mt-2 text-blue-600 font-bold hover:underline"
                onClick={handleAddNew}
              >
                Klik untuk tambah produk
              </button>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="group bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative"
              >
                <div className="aspect-square bg-slate-50 rounded-2xl mb-4 overflow-hidden relative border border-slate-50 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-slate-200">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  {product.stock <= 5 && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-lg">
                      Stok Menipis
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest truncate">
                      {categories.find((c) => c.id === product.category_id)
                        ?.name || "Tanpa Kategori"}
                    </p>
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {product.sku || "No SKU"}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                    <span className="text-lg font-black text-slate-900">
                      Rp {product.price?.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg flex items-center gap-1.5">
                      <Package size={12} className="text-slate-400" />
                      Stok: {product.stock}
                    </span>
                    {product.size && (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg uppercase">
                        Size: {product.size}
                      </span>
                    )}
                    {product.color && (
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg uppercase">
                        {product.color}
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute top-8 right-8 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <button
                    className="p-3 bg-white text-blue-600 rounded-xl shadow-xl hover:bg-blue-600 hover:text-white transition-all ring-1 ring-slate-100"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="p-3 bg-white text-red-600 rounded-xl shadow-xl hover:bg-red-600 hover:text-white transition-all ring-1 ring-slate-100"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${editingProduct ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}
                >
                  {editingProduct ? <Edit2 size={24} /> : <Plus size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    {editingProduct
                      ? "Perbarui informasi produk"
                      : "Masukkan informasi produk pakaian baru"}
                  </p>
                </div>
              </div>
              <button
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kemeja Flanel Slim Fit"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    SKU (Kode Produk)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: FP-KFL-001"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Gambar Produk
                </label>
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  {formData.image ? (
                    <div className="relative group shrink-0 w-32 h-32 rounded-xl overflow-hidden shadow-lg border-2 border-white">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setFormData({ ...formData, image: "" })}
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  ) : (
                    <div className="shrink-0 w-32 h-32 bg-white flex flex-col items-center justify-center rounded-xl border border-slate-200 text-slate-300">
                      <ImageIcon size={32} />
                      <span className="text-[10px] font-bold mt-2">
                        NO IMAGE
                      </span>
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <input
                      type="file"
                      id="product-image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024)
                            return alert(
                              "Ukuran file terlalu besar (Maks 10MB)",
                            );
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setFormData({ ...formData, image: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-all"
                    >
                      Pilih Foto Produk
                    </label>
                    <p className="text-[11px] text-slate-400 mt-3 font-medium uppercase tracking-wider">
                      Format: JPG, PNG, WEBP (Maksimal 10MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Ceritakan detail produk ini..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Stok Tersedia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Harga Jual (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="500"
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-black text-slate-900"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Varian Ukuran
                  </label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL, All Size"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Warna
                  </label>
                  <input
                    type="text"
                    placeholder="Black, Navy, Cream, Maroon"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-medium"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                  />
                </div>
              </div>
            </form>

            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4 sticky bottom-0 z-10">
              <button
                type="button"
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                type="submit"
                className={`px-8 py-3 text-white rounded-xl font-black shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2
                  ${editingProduct ? "bg-amber-600 shadow-amber-100 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {editingProduct ? <Edit2 size={20} /> : <Plus size={20} />}
                <span>
                  {editingProduct ? "Perbarui Produk" : "Simpan Produk"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
