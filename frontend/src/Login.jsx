import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Incorrect email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3edd9] text-[#1f1f1f] flex justify-center items-center px-4 py-12 paper-texture">
      <div className="w-full max-w-4xl bg-[#f3edd9] border-4 border-[#1f1f1f] shadow-[8px_8px_0px_0px_rgba(31,31,31,1)] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: JDM Magazine cover accents */}
        <div className="md:w-5/12 bg-[#ebe3cd] border-b-4 md:border-b-0 md:border-r-4 border-[#1f1f1f] p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#d1382b] mb-1">
              VOL. 04 | SUMMER 2026
            </div>
            <h2 className="text-4xl font-extrabold text-[#d1382b] leading-none mb-6">
              伝説のカオ
            </h2>
            <div className="border-t-2 border-b-2 border-[#1f1f1f] py-4 my-4 space-y-4 text-xs font-bold tracking-wider">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-[#d1382b] rounded-full"></span>
                <span>ICONIC INVENTORY MANAGER</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-[#1b5c65] rounded-full"></span>
                <span>JDM SPIRIT &apos;90s - Y2K</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-[#1f1f1f] rounded-full"></span>
                <span>TURBO CHARGED DATA</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="border-2 border-[#1f1f1f] p-3 text-center bg-[#faf8f5]">
              <span className="text-[10px] font-bold tracking-widest text-[#1b5c65] uppercase block mb-1">
                LEGEND NEVER DIES
              </span>
              <span className="text-lg font-black block leading-none">
                伝説は不滅
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] font-mono font-bold">
              <span>MADE IN JAPAN</span>
              <span>2002 08 15 04</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login credentials form */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#1f1f1f] leading-none">
                LOGIN / ログイン
              </h1>
              <span className="text-xs uppercase font-extrabold tracking-wider bg-[#d1382b] text-[#faf8f5] px-2.5 py-1">
                ACCESS SYSTEM
              </span>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[#faf8f5] border-l-4 border-[#d1382b] text-[#d1382b] text-xs font-bold uppercase tracking-wider">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1f1f1f] mb-2">
                  Email Address / メールアドレス
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-4 py-3 rounded-none font-bold placeholder:text-slate-400 focus:outline-none focus:bg-[#f3edd9] transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1f1f1f] mb-2">
                  Password / パスワード
                </label>
                <input
                  type="password"
                  required
                  className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-4 py-3 rounded-none font-bold placeholder:text-slate-400 focus:outline-none focus:bg-[#f3edd9] transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d1382b] text-[#faf8f5] border-2 border-[#1f1f1f] hover:bg-[#1f1f1f] hover:text-[#faf8f5] font-black uppercase tracking-widest py-4 px-6 text-sm transition-all duration-200 cursor-pointer shadow-[4px_4px_0px_0px_rgba(31,31,31,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(31,31,31,1)]"
              >
                {loading ? 'AUTHENTICATING...' : 'ENTER SYSTEM / ログイン'}
              </button>
            </form>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-350/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 font-bold">
              New Member?{' '}
              <Link to="/register" className="text-[#1b5c65] hover:text-[#d1382b] underline">
                Create Account / 登録
              </Link>
            </p>
            {/* Retro Barcode Accent */}
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono font-bold text-slate-400">APX-004-SYS</span>
              <div className="barcode w-24 h-6"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
