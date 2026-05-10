import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { AdminPublish } from './AdminPublish';
import { AdminCertificates } from './AdminCertificates';

interface AdminPanelProps {
  onLogout?: () => void;
}

export const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'publish' | 'certificates'>('messages');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) {
        setFetchError(error.message);
      } else if (data) {
        setMessages(data);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a192f] p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-5 py-2 border border-red-500 text-red-500 text-sm rounded hover:bg-red-500/10 transition-colors"
          >
            Log Out
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-4 px-4 font-semibold transition-colors ${
            activeTab === 'messages'
              ? 'text-[#00ff9f] border-b-2 border-[#00ff9f]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab('publish')}
          className={`pb-4 px-4 font-semibold transition-colors ${
            activeTab === 'publish'
              ? 'text-[#00ff9f] border-b-2 border-[#00ff9f]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Publish
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`pb-4 px-4 font-semibold transition-colors ${
            activeTab === 'certificates'
              ? 'text-[#00ff9f] border-b-2 border-[#00ff9f]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Certificates
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'messages' ? (
        <>
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : fetchError ? (
            <div className="text-red-500">Error: {fetchError}</div>
          ) : messages.length === 0 ? (
            <div className="text-white">Belum ada pesan masuk.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#112240] rounded-xl">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-[#00ff9f]">Nama</th>
                    <th className="px-4 py-2 text-[#00ff9f]">Email</th>
                    <th className="px-4 py-2 text-[#00ff9f]">Subjek</th>
                    <th className="px-4 py-2 text-[#00ff9f]">Pesan</th>
                    <th className="px-4 py-2 text-[#00ff9f]">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} className="border-b border-slate-800">
                      <td className="px-4 py-2 text-white">{msg.name}</td>
                      <td className="px-4 py-2 text-white">{msg.email}</td>
                      <td className="px-4 py-2 text-white">{msg.subject}</td>
                      <td className="px-4 py-2 text-white">{msg.message}</td>
                      <td className="px-4 py-2 text-white">{new Date(msg.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : activeTab === 'publish' ? (
        <AdminPublish />
      ) : (
        <AdminCertificates />
      )}
    </div>
  );
};
