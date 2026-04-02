import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Eye, EyeOff, AlertCircle, Mail, Lock } from "lucide-react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email,
          password,
          remember_me: rememberMe,
        }
      );

      localStorage.setItem("token", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      
      if (onLogin) {
        onLogin(true);
      }
      
      alert("Login berhasil!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login gagal! Periksa email dan password Anda.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 md:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 mb-6">
              <ShoppingBag size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fashion POS</h1>
            <p className="text-slate-500 mt-2 font-medium">
              Sistem Kasir Pakaian Modern
            </p>
          </div>

          <form className="p-8 pt-2" onSubmit={handleLogin}>
            {error && (
              <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm animate-fadeIn">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="mb-5">
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
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
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
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">
                  Ingat saya
                </label>
              </div>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : "Masuk"}
            </button>
          </form>

          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Belum punya akun? <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Login;