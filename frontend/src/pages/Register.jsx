import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Eye, EyeOff, AlertCircle, Mail, Lock, User, CheckCircle2 } from "lucide-react";
import { authAPI } from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authAPI.register({
        name,
        email,
        password,
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Pendaftaran gagal! Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="w-full max-w-md animate-bounceIn">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-2">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pendaftaran Berhasil!</h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                Akun Anda telah berhasil dibuat. Namun, demi keamanan, akun Anda 
                <span className="text-blue-600 font-bold"> perlu diaktifkan oleh Admin </span> 
                terlebih dahulu sebelum Anda dapat masuk.
              </p>
            </div>
            <div className="pt-4">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Kembali ke Login
              </Link>
            </div>
            <p className="text-xs text-slate-400">Anda akan diarahkan otomatis dalam beberapa detik...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 md:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 mb-6">
              <ShoppingBag size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Akun Baru</h1>
            <p className="text-slate-500 mt-2 font-medium">
              Bergabung dengan Fashion POS
            </p>
          </div>

          <form className="p-8 pt-2 space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="flex items-center gap-3 p-4 mb-2 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm animate-fadeIn">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="name">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="Nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="Alamat email aktif"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mendaftarkan...</span>
                </div>
              ) : "Daftar Akun"}
            </button>
          </form>

          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Sudah punya akun? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
