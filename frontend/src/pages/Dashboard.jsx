import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Products from "./Products";
import POS from "./POS";
import Categories from "./Categories";
import Transactions from "./Transactions";
import SalesReports from "./SalesReports";
import UsersPage from "./Users";
import { transactionsAPI } from "../services/api";
import {
  ShoppingBag,
  LayoutDashboard,
  ShoppingCart,
  Shirt,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Search,
  LogOut,
  Menu,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  FileText,
  X
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : { name: "Admin", role: "Administrator" };
    } catch (e) {
      return { name: "Admin", role: "Administrator" };
    }
  });
  
  const getMenuFromPath = () => {
    const path = location.pathname.substring(1);
    return path || 'dashboard';
  };

  const [activeMenu, setActiveMenu] = useState(getMenuFromPath());
  const [visitedPages, setVisitedPages] = useState(new Set([getMenuFromPath(), 'dashboard']));
  const [dataVersion, setDataVersion] = useState(0);
  const [stats, setStats] = useState({
    total_sales: 0,
    new_transactions: 0,
    products_sold: 0,
    total_stock: 0,
    total_products: 0,
    total_categories: 0,
    total_users: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await transactionsAPI.getStats();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [activeMenu]); // Refresh stats when switching to dashboard

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(`http://localhost:8000/api/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.status === 'success' && result.data) {
              const userData = result.data;
              const newUserState = {
                name: userData.name || "User",
                role: userData.role || "User"
              };
              setCurrentUser(newUserState);
              localStorage.setItem("user", JSON.stringify(userData));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const currentMenu = getMenuFromPath();
    const adminOnlyPages = ['products', 'categories', 'users'];
    
    // Guard: Kasir cannot access admin pages
    if (adminOnlyPages.includes(currentMenu) && currentUser.role?.toLowerCase() === 'kasir') {
      navigate('/dashboard');
      return;
    }

    setActiveMenu(currentMenu);
    setVisitedPages(prev => {
      const newSet = new Set(prev);
      newSet.add(currentMenu);
      return newSet;
    });
  }, [location.pathname, currentUser.role, navigate]);

  const handleMenuClick = (menuId) => {
    navigate(`/${menuId === 'dashboard' ? 'dashboard' : menuId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  const menuItems = [
    {
      section: "Main",
      items: [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "pos", icon: ShoppingCart, label: "Point of Sale" },
        ...(currentUser.role?.toLowerCase() === 'admin' ? [
          { id: "products", icon: Shirt, label: "Produk Pakaian" },
          { id: "categories", icon: Tag, label: "Kategori" },
        ] : []),
      ],
    },
    {
      section: "Transaksi",
      items: [
        { id: "transactions", icon: DollarSign, label: "Riwayat Transaksi" },
        { id: "sales", icon: TrendingUp, label: "Laporan Penjualan" },
      ],
    },
    ...(currentUser.role?.toLowerCase() === 'admin' ? [{
      section: "Manajemen",
      items: [
        { id: "users", icon: Users, label: "Pengguna" },
      ],
    }] : []),
  ];

  const quickActions = [
    { icon: ShoppingCart, label: "Transaksi Baru", action: () => handleMenuClick("pos"), color: "bg-blue-600 shadow-blue-200" },
    ...(currentUser.role?.toLowerCase() === 'admin' ? [
      { icon: Plus, label: "Tambah Produk", action: () => handleMenuClick("products"), color: "bg-emerald-600 shadow-emerald-200" },
      { icon: Tag, label: "Kategori", action: () => handleMenuClick("categories"), color: "bg-purple-600 shadow-purple-200" },
    ] : []),
    { icon: FileText, label: "Lihat Laporan", action: () => handleMenuClick("transactions"), color: "bg-amber-600 shadow-amber-200" },
  ];

  const statsData = [
    {
      icon: Package,
      color: "text-amber-600 bg-amber-50",
      title: "Stok Tersedia",
      value: (stats.total_stock || 0).toLocaleString(),
      trend: { direction: "down", value: "Item" },
    },
    {
      icon: Shirt,
      color: "text-blue-600 bg-blue-50",
      title: "Koleksi Produk",
      value: (stats.total_products || 0).toLocaleString(),
      trend: { direction: "up", value: "Item" },
    },
    {
      icon: Tag,
      color: "text-purple-600 bg-purple-50",
      title: "Kategori",
      value: (stats.total_categories || 0).toString(),
      trend: { direction: "up", value: "Grup" },
    },
    {
      icon: Users,
      color: "text-emerald-600 bg-emerald-50",
      title: "Kasir Aktif",
      value: (stats.total_users || 0).toString(),
      trend: { direction: "up", value: "Tim" },
    },
  ];

  const getFirstName = (fullName) => fullName.split(' ')[0];

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Overlay for Mobile */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}
      >
        <div className={`flex items-center border-b border-slate-50 transition-all duration-300 ${sidebarOpen ? 'p-6 justify-between' : 'p-4 justify-center'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`shrink-0 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 transition-all duration-300 ${sidebarOpen ? 'w-10 h-10' : 'w-12 h-12'}`}>
              <ShoppingBag size={sidebarOpen ? 22 : 24} />
            </div>
            {sidebarOpen && (
              <div className="animate-fadeIn">
                <h2 className="text-lg font-bold text-slate-900 whitespace-nowrap">Fashion POS</h2>
                <p className="text-xs font-medium text-slate-500">Kasir Pakaian Modern</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          {menuItems.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {sidebarOpen && (
                <div className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {section.section}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-50' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
                    >
                      <IconComponent 
                        size={20} 
                        className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
                      />
                      {sidebarOpen && <span className="font-semibold text-sm animate-fadeIn">{item.label}</span>}
                      {isActive && !sidebarOpen && (
                        <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info - Avatar removed, name kept */}
        {sidebarOpen && (
          <div className="p-6 border-t border-slate-100 animate-fadeIn">
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h4>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">{currentUser.role}</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6 flex-1">
            <button
              className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={22} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block" />
            <button
              className="flex items-center gap-2 p-2 px-3 text-red-600 hover:bg-red-50 font-bold text-sm rounded-xl transition-all active:scale-95"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span className="hidden sm:block">Keluar</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {/* Dashboard Home Content */}
          {activeMenu === 'dashboard' && (
            <div className="animate-fadeIn max-w-7xl mx-auto space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Halo, {getFirstName(currentUser.name)} 👋
                  </h1>
                  <p className="text-slate-500 font-medium text-lg">
                    Berikut ringkasan performa bisnis Anda hari ini.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-500 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sistem Aktif
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {quickActions.map((action, idx) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={action.action}
                      className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 text-left flex flex-col gap-4 overflow-hidden relative"
                    >
                      <div className={`w-14 h-14 ${action.color} text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300`}>
                        <IconComponent size={28} />
                      </div>
                      <span className="font-bold text-slate-900 text-lg">{action.label}</span>
                      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <IconComponent size={120} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, idx) => {
                  const IconComponent = stat.icon;
                  const isUp = stat.trend.direction === "up";
                  return (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-5">
                        <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:rotate-12`}>
                          <IconComponent size={24} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                        <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Pages */}
          <div style={{ display: activeMenu === 'pos' ? 'block' : 'none' }}>
             {visitedPages.has('pos') && <POS dataVersion={dataVersion} />}
          </div>
          <div style={{ display: (activeMenu === 'products' && currentUser.role?.toLowerCase() === 'admin') ? 'block' : 'none' }}>
             {visitedPages.has('products') && currentUser.role?.toLowerCase() === 'admin' && <Products onDataChange={() => setDataVersion(v => v + 1)} />}
          </div>
          <div style={{ display: (activeMenu === 'categories' && currentUser.role?.toLowerCase() === 'admin') ? 'block' : 'none' }}>
             {visitedPages.has('categories') && currentUser.role?.toLowerCase() === 'admin' && <Categories />}
          </div>
          <div style={{ display: activeMenu === 'transactions' ? 'block' : 'none' }}>
             {visitedPages.has('transactions') && <Transactions />}
          </div>
          <div style={{ display: activeMenu === 'sales' ? 'block' : 'none' }}>
             {visitedPages.has('sales') && <SalesReports />}
          </div>
          <div style={{ display: (activeMenu === 'users' && currentUser.role?.toLowerCase() === 'admin') ? 'block' : 'none' }}>
             {visitedPages.has('users') && currentUser.role?.toLowerCase() === 'admin' && <UsersPage />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
