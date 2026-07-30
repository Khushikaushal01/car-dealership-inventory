import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

export default function Admin() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [restockAmount, setRestockAmount] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/');
      return;
    }
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API_URL}/vehicles`);
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to load active fleet catalog');
    }
  };

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await axios.post(
        `${API_URL}/vehicles`,
        {
          make: newVehicle.make,
          model: newVehicle.model,
          category: newVehicle.category,
          price: parseFloat(newVehicle.price),
          quantity: parseInt(newVehicle.quantity)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Successfully added ${newVehicle.make} ${newVehicle.model} to stock.`);
      setNewVehicle({ make: '', model: '', category: '', price: '', quantity: '' });
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add vehicle to inventory');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle listing?')) return;
    setError('');
    setMessage('');
    try {
      await axios.delete(`${API_URL}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Vehicle deleted successfully.');
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete vehicle');
    }
  };

  const handleRestock = async (id) => {
    const qty = parseInt(restockAmount[id] || 1);
    setError('');
    setMessage('');
    try {
      await axios.post(
        `${API_URL}/vehicles/${id}/restock?qty=${qty}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Stock updated successfully.');
      setRestockAmount({ ...restockAmount, [id]: '' });
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to restock vehicle');
    }
  };

  const handleUpdatePrice = async (vehicle) => {
    const newPriceStr = window.prompt(`Enter new price for ${vehicle.make} ${vehicle.model}:`, vehicle.price);
    if (newPriceStr === null) return;
    const newPrice = parseFloat(newPriceStr);
    if (isNaN(newPrice)) {
      alert('Invalid price entered');
      return;
    }
    setError('');
    setMessage('');
    try {
      await axios.put(
        `${API_URL}/vehicles/${vehicle.id}`,
        { price: newPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Price updated successfully.');
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update price');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f3edd9] flex flex-col justify-center items-center px-4">
        <h2 className="text-3xl font-black text-[#d1382b] tracking-tighter">ACCESS DENIED / 警告</h2>
        <p className="text-slate-500 mt-2 font-bold uppercase tracking-wider text-xs">
          Only authorized editors can access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3edd9] text-[#1f1f1f] px-6 py-10 paper-texture">
      <div className="max-w-7xl mx-auto">
        
        {/* Admin Header Banner */}
        <header className="border-4 border-[#1f1f1f] bg-[#1b5c65] text-[#faf8f5] p-6 mb-10 shadow-[6px_6px_0px_0px_rgba(31,31,31,1)] flex justify-between items-center relative">
          <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-[#d1382b] rounded-full border border-[#1f1f1f]"></div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#faf8f5] opacity-80 uppercase block mb-1">
              ADMIN CONTROL / MANAGING EDITOR SYSTEM
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">
              Fleet Database Manager / <span className="text-[#faf8f5]/80">管理者パネル</span>
            </h1>
          </div>
          <span className="text-xs uppercase font-extrabold tracking-wider bg-[#d1382b] text-[#faf8f5] px-3 py-1.5 border-2 border-[#faf8f5] hidden md:inline-block">
            ADMIN SYSTEM
          </span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Add Vehicle Column */}
          <section className="bg-[#faf8f5] border-4 border-[#1f1f1f] p-6 shadow-[4px_4px_0px_0px_rgba(31,31,31,1)]">
            <h2 className="text-lg font-black border-b-2 border-[#1f1f1f] pb-3 mb-6 text-[#1f1f1f] flex items-center">
              <span className="w-3.5 h-3.5 bg-[#d1382b] inline-block mr-2 border border-[#1f1f1f]"></span>
              ADD NEW ENTRY / 車両追加
            </h2>
            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Make / メーカー</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota"
                  className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#f3edd9] transition-all"
                  value={newVehicle.make}
                  onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Model / モデル</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Camry"
                  className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#f3edd9] transition-all"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Category / 区分</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sedan"
                  className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#f3edd9] transition-all"
                  value={newVehicle.category}
                  onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Price / 価格 ($)</label>
                <input
                  type="number"
                  required
                  placeholder="25000"
                  className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#f3edd9] transition-all"
                  value={newVehicle.price}
                  onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Quantity / 数量</label>
                <input
                  type="number"
                  required
                  placeholder="10"
                  className="w-full bg-[#faf8f5] border-2 border-[#1f1f1f] text-[#1f1f1f] px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#f3edd9] transition-all"
                  value={newVehicle.quantity}
                  onChange={(e) => setNewVehicle({ ...newVehicle, quantity: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#d1382b] text-[#faf8f5] border-2 border-[#1f1f1f] hover:bg-[#1f1f1f] hover:text-[#faf8f5] font-black uppercase tracking-widest py-3 px-4 text-xs transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_0px_rgba(31,31,31,1)]"
              >
                COMMIT ENTRY / 追加
              </button>
            </form>
          </section>

          {/* Database Specs Grid Table */}
          <section className="lg:col-span-2 bg-[#faf8f5] border-4 border-[#1f1f1f] p-6 shadow-[4px_4px_0px_0px_rgba(31,31,31,1)] overflow-x-auto">
            <h2 className="text-lg font-black border-b-2 border-[#1f1f1f] pb-3 mb-6 text-[#1f1f1f] flex items-center">
              <span className="w-3.5 h-3.5 bg-[#1b5c65] inline-block mr-2 border border-[#1f1f1f]"></span>
              ACTIVE VEHICLES CATALOGUE / アクティブカタログ
            </h2>
            {vehicles.length === 0 ? (
              <p className="text-[#1f1f1f] font-bold text-xs uppercase">No vehicles registered.</p>
            ) : (
              <table className="w-full text-left text-xs font-bold border-collapse border-2 border-[#1f1f1f]">
                <thead>
                  <tr className="bg-[#ebe3cd] border-b-2 border-[#1f1f1f]">
                    <th className="py-3 px-4 border-r border-[#1f1f1f] uppercase tracking-wider">Vehicle Spec</th>
                    <th className="py-3 px-4 border-r border-[#1f1f1f] uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 border-r border-[#1f1f1f] uppercase tracking-wider">Pricing</th>
                    <th className="py-3 px-4 border-r border-[#1f1f1f] uppercase tracking-wider text-center">Stock</th>
                    <th className="py-3 px-4 uppercase tracking-wider text-center">Operation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-[#1f1f1f] border-t-2">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-[#ebe3cd]/20 transition-all font-mono">
                      <td className="py-3 px-4 border-r border-[#1f1f1f] font-bold text-[#1f1f1f] font-sans">
                        <span className="font-extrabold uppercase">{v.make}</span> {v.model}
                      </td>
                      <td className="py-3 px-4 border-r border-[#1f1f1f] uppercase font-sans">
                        {v.category}
                      </td>
                      <td className="py-3 px-4 border-r border-[#1f1f1f] font-bold">
                        ${v.price.toLocaleString()}
                        <button
                          onClick={() => handleUpdatePrice(v)}
                          className="ml-2 text-[#1b5c65] hover:text-[#d1382b] underline cursor-pointer font-bold font-sans text-[10px]"
                        >
                          EDIT
                        </button>
                      </td>
                      <td className={`py-3 px-4 border-r border-[#1f1f1f] text-center font-black ${
                        v.quantity === 0 ? 'text-[#d1382b]' : 'text-[#1b5c65]'
                      }`}>
                        {v.quantity} units
                      </td>
                      <td className="py-3 px-4 flex items-center justify-center gap-3">
                        <div className="flex items-center space-x-1 border border-[#1f1f1f] bg-[#faf8f5] p-1">
                          <input
                            type="number"
                            placeholder="Qty"
                            className="bg-transparent text-[#1f1f1f] w-8 text-center text-xs font-bold focus:outline-none"
                            value={restockAmount[v.id] || ''}
                            onChange={(e) => setRestockAmount({ ...restockAmount, [v.id]: e.target.value })}
                          />
                          <button
                            onClick={() => handleRestock(v.id)}
                            className="bg-[#1b5c65] text-[#faf8f5] text-[10px] font-black uppercase px-2 py-1 hover:bg-[#1f1f1f] transition-all cursor-pointer"
                          >
                            RESTOCK
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeleteVehicle(v.id)}
                          className="bg-[#d1382b] text-[#faf8f5] border border-[#1f1f1f] font-black px-2.5 py-1.5 hover:bg-[#1f1f1f] transition-all cursor-pointer text-[10px]"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        {/* Page Footer Barcode Accent */}
        <footer className="mt-16 pt-8 border-t-2 border-[#1f1f1f] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400">
          <span>APEX MOTORS INC. // DESIGN INSPIRATION 2002 SUMMER</span>
          <div className="flex items-center space-x-2">
            <span>VOL.04_SPECIFICATIONS_SYSTEM</span>
            <div className="barcode w-32 h-8"></div>
          </div>
        </footer>

      </div>
    </div>
  );
}
