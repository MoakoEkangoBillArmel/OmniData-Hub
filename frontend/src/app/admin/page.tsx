"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Database, Activity, LogOut, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      try {
        const res = await axios.get(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err: any) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          router.push('/login');
        }
      } finally { setLoading(false); }
    };
    fetchUsers();
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalQueries = users.reduce((acc, user) => acc + user.query_count, 0);

  return (
    <div className="text-foreground">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <ShieldAlert className="text-white" size={20} />
            </div>
            Centre de Contrôle
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Supervision des utilisateurs et de l'activité de la plateforme</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="btn-primary text-sm py-2.5">
            <TrendingUp size={16} /> Dashboard d'Analyse
          </button>
          <button onClick={logout} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card border-l-4 border-l-indigo-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilisateurs Inscrits</p>
            <h3 className="text-4xl font-black mt-2">{users.length}</h3>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl"><Users className="text-indigo-400" size={24} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card border-l-4 border-l-purple-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Requêtes ML Total</p>
            <h3 className="text-4xl font-black mt-2">{totalQueries}</h3>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl"><Activity className="text-purple-400" size={24} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base de Données</p>
            <h3 className="text-xl font-bold mt-2 text-emerald-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot inline-block"></span> En ligne
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl"><Database className="text-emerald-400" size={24} /></div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-lg">Registre des Utilisateurs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Requêtes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  key={user.id} 
                  className="hover:bg-indigo-500/3 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-400 font-mono text-sm">#{user.id}</td>
                  <td className="px-6 py-4 font-medium">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-emerald-500">{user.query_count}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
