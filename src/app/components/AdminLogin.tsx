import React, { useState } from 'react';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Ganti dengan password yang lebih aman di production

export const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError('');
      onLogin();
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a192f]">
      <form onSubmit={handleSubmit} className="bg-[#112240] p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block text-[#00ff9f] mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#0a192f] border border-slate-700 text-white"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-[#00ff9f] mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#0a192f] border border-slate-700 text-white"
            required
          />
        </div>
        <button type="submit" className="w-full bg-[#00ff9f] text-[#0a192f] py-2 rounded font-bold hover:bg-[#00e08b] transition-all">Login</button>
      </form>
    </div>
  );
};
