import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [searchParams, setSearchParams] = useState({
    make: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async (params = {}) => {
    try {
      const activeParams = {};
      if (params.make) activeParams.make = params.make;
      if (params.category) activeParams.category = params.category;
      if (params.minPrice) activeParams.min_price = params.minPrice;
      if (params.maxPrice) activeParams.max_price = params.maxPrice;

      const response = await axios.get(`${API_URL}/vehicles/search`, { params: activeParams });
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to fetch vehicle database');
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    const newParams = { ...searchParams, [name]: value };
    setSearchParams(newParams);
    fetchVehicles(newParams);
  };

  const handleClearFilters = () => {
    const cleared = { make: '', category: '', minPrice: '', maxPrice: '' };
    setSearchParams(cleared);
    fetchVehicles(cleared);
  };

  const handlePurchase = async (vehicleId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    setError('');
    setMessage('');
    try {
      const response = await axios.post(
        `${API_URL}/vehicles/${vehicleId}/purchase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Successfully purchased ${response.data.make} ${response.data.model}!`);
      fetchVehicles(searchParams);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to complete purchase');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3edd9] text-[#1f1f1f] px-6 py-10 paper-texture">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block reminiscent of Magazine Front Cover Header */}
        <header className="border-4 border-[#1f1f1f] bg-[#ebe3cd] p-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center relative shadow-[6px_6px_0px_0px_rgba(31,31,31,1)]">
          {/* Japan dot element */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-[#d1382b] rounded-full"></div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#1b5c65] uppercase block mb-1">
              BUILT FOR THE STREETS. BORN TO INSPIRE.
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-[#1f1f1f] leading-tight break-words">
              CAR DEALERSHIP INVENTORY <br className="md:hidden" /> / <span className="text-[#d1382b] inline-block">伝説の車</span>
            </h1>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end border-l-2 md:border-l-0 md:border-t-0 border-[#1f1f1f] pl-4 md:pl-0 pt-2 md:pt-0">
            <span className="text-lg font-black tracking-widest">VOL. 04</span>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              SUMMER 2026 EDITION
            </span>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-[#faf8f5] border-l-4 border-[#d1382b] text-[#d1382b] text-xs font-bold uppercase tracking-wider">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-4 bg-[#faf8f5] border-l-4 border-[#1b5c65] text-[#1b5c65] text-xs font-bold uppercase tracking-wider">
            {message}
          </div>
        )}

        {/* Specifications Filter Panel */}
        <section className="bg-[#faf8f5] border-4 border-[#1f1f1f] p-6 rounded-none mb-10 shadow-[4px_4px_0px_0px_rgba(31,31,31,1)]">
          <div className="flex justify-between items-center mb-4 border-b-2 border-[#1f1f1f] pb-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#1f1f1f] flex items-center">
              <span className="w-3.5 h-3.5 bg-[#1b5c65] inline-block mr-2 border border-[#1f1f1f]"></span>
              Search Parameters / 検索フィルター
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-[10px] font-black uppercase tracking-widest text-[#d1382b] hover:underline"
            >
              Reset / クリア
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#1f1f1f] uppercase tracking-wider mb-2">Search Make</label>
              <input
                type="text"
                name="make"
                placeholder="e.g. Toyota"
                className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#f3edd9] transition-all"
                value={searchParams.make}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#1f1f1f] uppercase tracking-wider mb-2">Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Sedan"
                className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#f3edd9] transition-all"
                value={searchParams.category}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#1f1f1f] uppercase tracking-wider mb-2">Min Price (₹)</label>
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#f3edd9] transition-all"
                value={searchParams.minPrice}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#1f1f1f] uppercase tracking-wider mb-2">Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#f3edd9] transition-all"
                value={searchParams.maxPrice}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </section>

        {/* Vehicles Specifications Cards Grid */}
        {vehicles.length === 0 ? (
          <div className="text-center py-20 bg-[#ebe3cd] border-4 border-dashed border-[#1f1f1f]">
            <p className="text-[#1f1f1f] font-bold uppercase tracking-wider text-sm">
              No vehicles available in the database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => {
              const isOutOfStock = vehicle.quantity <= 0;
              return (
                <div key={vehicle.id} className="bg-[#faf8f5] border-4 border-[#1f1f1f] shadow-[6px_6px_0px_0px_rgba(31,31,31,1)] flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(31,31,31,1)] transition-all duration-200">
                  
                  {/* Card Header */}
                  <div className="p-5 border-b-2 border-[#1f1f1f] flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b5c65] bg-[#1b5c65]/10 px-2 py-0.5 border border-[#1b5c65]/20">
                        {vehicle.category}
                      </span>
                      <h2 className="text-2xl font-black tracking-tight text-[#1f1f1f] leading-none mt-2">
                        {vehicle.make}
                      </h2>
                      <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mt-1">
                        {vehicle.model}
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">STOCK</span>
                      <span className={`text-xs font-black uppercase px-2 py-0.5 border ${
                        isOutOfStock 
                          ? 'text-[#d1382b] bg-red-50 border-[#d1382b]' 
                          : 'text-[#1b5c65] bg-emerald-50 border-[#1b5c65]'
                      }`}>
                        {isOutOfStock ? 'SOLD OUT' : `${vehicle.quantity} UNITS`}
                      </span>
                    </div>
                  </div>

                  {/* Card Specifications Table */}
                  <div className="p-5 bg-[#ebe3cd]/30 border-b-2 border-[#1f1f1f]">
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                      SPECIFICATIONS / スペック
                    </div>
                    <div className="border border-[#1f1f1f] text-xs font-mono">
                      <div className="flex border-b border-[#1f1f1f]">
                        <div className="w-1/2 p-2 bg-[#ebe3cd]/60 border-r border-[#1f1f1f] font-bold">MAKE / 製造元</div>
                        <div className="w-1/2 p-2 font-bold uppercase">{vehicle.make}</div>
                      </div>
                      <div className="flex border-b border-[#1f1f1f]">
                        <div className="w-1/2 p-2 bg-[#ebe3cd]/60 border-r border-[#1f1f1f] font-bold">MODEL / モデル</div>
                        <div className="w-1/2 p-2 font-bold uppercase">{vehicle.model}</div>
                      </div>
                      <div className="flex">
                        <div className="w-1/2 p-2 bg-[#ebe3cd]/60 border-r border-[#1f1f1f] font-bold">CATEGORY / 区分</div>
                        <div className="w-1/2 p-2 font-bold uppercase">{vehicle.category}</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Pricing & Action footer */}
                  <div className="p-5 flex justify-between items-center bg-[#faf8f5]">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">PRICING</span>
                      <span className="text-2xl font-black text-[#d1382b] tracking-tight leading-none mt-1">
                        ₹{vehicle.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePurchase(vehicle.id)}
                      disabled={isOutOfStock}
                      className={`font-black uppercase tracking-wider py-2.5 px-4 text-xs border-2 border-[#1f1f1f] transition-all shadow-[2px_2px_0px_0px_rgba(31,31,31,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(31,31,31,1)] cursor-pointer ${
                        isOutOfStock
                          ? 'bg-[#1f1f1f] text-[#faf8f5] opacity-50 cursor-not-allowed shadow-none active:translate-x-0 active:translate-y-0'
                          : 'bg-[#d1382b] text-[#faf8f5] hover:bg-[#1f1f1f] hover:text-[#faf8f5]'
                      }`}
                    >
                      {isOutOfStock ? 'OUT OF STOCK' : 'PURCHASE / 購入'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Page Footer Barcode Accent */}
        <footer className="mt-16 pt-8 border-t-2 border-[#1f1f1f] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400">
          <span>MADE IN INDIA MOTORS INC. // DESIGN INSPIRATION 2002 SUMMER</span>
          <div className="flex items-center space-x-2">
            <span>VOL.04_SPECIFICATIONS_SYSTEM</span>
            <div className="barcode w-32 h-8"></div>
          </div>
        </footer>

      </div>
    </div>
  );
}
