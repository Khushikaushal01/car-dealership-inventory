import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        is_admin: formData.isAdmin
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
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
              新規登録
            </h2>
            <div className="border-t-2 border-b-2 border-[#1f1f1f] py-4 my-4 space-y-4 text-xs font-bold tracking-wider">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-[#d1382b] rounded-full"></span>
                <span>AUTHENTIC ACCOUNT SETUP</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-[#1b5c65] rounded-full"></span>
                <span>JDM STYLE & SPECIFICATION</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-[#1f1f1f] rounded-full"></span>
                <span>Y2K HERITAGE DESIGN</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="border-2 border-[#1f1f1f] p-3 text-center bg-[#faf8f5]">
              <span className="text-[10px] font-bold tracking-widest text-[#1b5c65] uppercase block mb-1">
                JOIN THE LEAGUE
              </span>
              <span className="text-lg font-black block leading-none">
                黄金時代に参加
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] font-mono font-bold">
              <span>MADE IN JAPAN</span>
              <span>2002 08 15 04</span>
            </div>
          </div>
        </div>

        {/* Right Side: Register form */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#1f1f1f] leading-none">
                REGISTER / 登録
              </h1>
              <span className="text-xs uppercase font-extrabold tracking-wider bg-[#1b5c65] text-[#faf8f5] px-2.5 py-1">
                CREATE IDENTITY
              </span>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[#faf8f5] border-l-4 border-[#d1382b] text-[#d1382b] text-xs font-bold uppercase tracking-wider">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1f1f1f] mb-1.5">
                  Username / ユーザー名
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-4 py-2.5 rounded-none font-bold placeholder:text-slate-400 focus:outline-none focus:bg-[#f3edd9] transition-all"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1f1f1f] mb-1.5">
                  Email Address / メールアドレス
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-4 py-2.5 rounded-none font-bold placeholder:text-slate-400 focus:outline-none focus:bg-[#f3edd9] transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1f1f1f] mb-1.5">
                  Password / パスワード
                </label>
                <input
                  type="password"
                  required
                  className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-4 py-2.5 rounded-none font-bold placeholder:text-slate-400 focus:outline-none focus:bg-[#f3edd9] transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="flex items-center py-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  className="w-4 h-4 rounded bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#d1382b] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  checked={formData.isAdmin}
                  onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                />
                <label htmlFor="isAdmin" className="ml-2 text-xs font-bold uppercase tracking-wider text-[#1f1f1f] cursor-pointer select-none">
                  Register as Administrator / 管理者登録
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1b5c65] text-[#faf8f5] border-2 border-[#1f1f1f] hover:bg-[#1f1f1f] hover:text-[#faf8f5] font-black uppercase tracking-widest py-4 px-6 text-sm transition-all duration-200 cursor-pointer shadow-[4px_4px_0px_0px_rgba(31,31,31,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(31,31,31,1)]"
              >
                {loading ? 'CREATING PROFILE...' : 'REGISTER PROFILE / 新規登録'}
              </button>
            </form>
          </div>

          <div className="mt-10 pt-4 border-t border-slate-350/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 font-bold">
              Existing Account?{' '}
              <Link to="/login" className="text-[#d1382b] hover:text-[#1b5c65] underline">
                Sign In / ログイン
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
