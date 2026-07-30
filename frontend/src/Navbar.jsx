import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-[#f3edd9] border-b-4 border-double border-[#1f1f1f] text-[#1f1f1f] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
      <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => navigate('/')}>
        <div className="bg-[#d1382b] text-[#faf8f5] w-9 h-9 flex items-center justify-center font-black text-xl border-2 border-[#1f1f1f] shadow-[2px_2px_0px_0px_rgba(31,31,31,1)]">
          A
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-widest leading-none">
            APEX INVENTORY
          </span>
          <span className="text-[9px] font-bold tracking-widest uppercase text-[#1b5c65] leading-none mt-1">
            SUPRA STYLE MAGAZINE
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-xs font-black uppercase tracking-widest">
        <Link to="/" className="hover:text-[#d1382b] border-b-2 border-transparent hover:border-[#d1382b] transition-all py-1">
          Showroom / ショールーム
        </Link>

        {token && isAdmin && (
          <Link to="/admin" className="text-[#faf8f5] bg-[#1b5c65] border-2 border-[#1f1f1f] px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(31,31,31,1)] hover:bg-[#1f1f1f] hover:text-[#faf8f5] transition-all">
            Admin Panel / 管理
          </Link>
        )}

        {token ? (
          <div className="flex items-center space-x-4 border-l-2 border-[#1f1f1f] pl-6">
            <span className="text-[#1f1f1f] font-bold normal-case">
              User: <span className="font-black underline">{user.username}</span>
              {isAdmin && <span className="ml-1.5 px-2 py-0.5 text-[8px] tracking-widest font-black uppercase text-[#faf8f5] bg-[#d1382b] border border-[#1f1f1f]">Admin</span>}
            </span>
            <button
              onClick={handleLogout}
              className="bg-[#faf8f5] border-2 border-[#1f1f1f] hover:bg-[#d1382b] hover:text-[#faf8f5] text-[#1f1f1f] font-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(31,31,31,1)] transition-all cursor-pointer text-[10px]"
            >
              LOGOUT / 終了
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 border-l-2 border-[#1f1f1f] pl-6">
            <Link to="/login" className="hover:text-[#d1382b] py-1">
              Login / ログイン
            </Link>
            <Link
              to="/register"
              className="bg-[#d1382b] text-[#faf8f5] border-2 border-[#1f1f1f] px-4 py-2 shadow-[2px_2px_0px_0px_rgba(31,31,31,1)] hover:bg-[#1f1f1f] hover:text-[#faf8f5] transition-all"
            >
              Sign Up / 登録
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
