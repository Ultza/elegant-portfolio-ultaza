import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { AdminPublish } from './AdminPublish';
import { AdminCertificates } from './AdminCertificates';
import { AdminLearning } from './AdminLearning';

interface AdminPanelProps {
  onLogout?: () => void;
}

export const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'publish' | 'certificates' | 'learning'>('messages');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) { setFetchError(error.message); }
      else if (data) { setMessages(data); }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'messages',     label: 'Pesan Masuk'  },
    { key: 'publish',      label: 'Artikel'       },
    { key: 'learning',     label: 'Learning'      },
    { key: 'certificates', label: 'Sertifikat'    },
  ];

  return (
    <div className="min-h-screen bg-[#0a192f] p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
        {onLogout && (
          <button onClick={onLogout} className="px-5 py-2 border border-red-500 text-red-500 text-sm rounded hover:bg-red-500/10 transition-colors">
            Keluar
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 border-b border-slate-700 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`pb-4 px-5 font-semibold text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'text-[#00ff9f] border-b-2 border-[#00ff9f]'
                : 'text-slate-400 hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'messages' && (
        <>
          {loading ? (
            <div className="text-white">Memuat...</div>
          ) : fetchError ? (
            <div className="text-red-500">Error: {fetchError}</div>
          ) : messages.length === 0 ? (
            <div className="text-white">Belum ada pesan masuk.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#112240] rounded-xl">
                <thead>
                  <tr>
                    {['Nama','Email','Subjek','Pesan','Tanggal'].map(h => (
                      <th key={h} className="px-4 py-3 text-[#00ff9f] text-left text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} className="border-b border-slate-800">
                      <td className="px-4 py-3 text-white text-sm">{msg.name}</td>
                      <td className="px-4 py-3 text-white text-sm">{msg.email}</td>
                      <td className="px-4 py-3 text-white text-sm">{msg.subject}</td>
                      <td className="px-4 py-3 text-white text-sm max-w-xs truncate">{msg.message}</td>
                      <td className="px-4 py-3 text-white text-sm whitespace-nowrap">{new Date(msg.created_at).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      {activeTab === 'publish'      && <AdminPublish />}
      {activeTab === 'learning'     && <AdminLearning />}
      {activeTab === 'certificates' && <AdminCertificates />}
    </div>
  );
};
