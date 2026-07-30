import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f3edd9] text-[#1f1f1f] antialiased">
        <main className="p-4">
          <Routes>
            <Route path="/" element={<div className="font-bold">Dashboard Placeholder</div>} />
            <Route path="/login" element={<div>Login Placeholder</div>} />
            <Route path="/register" element={<div>Register Placeholder</div>} />
            <Route path="/admin" element={<div>Admin Placeholder</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
