'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, RefreshCw, Key, FileText, Eye } from 'lucide-react';

interface Log {
  id: number;
  action: string;
  createdAt: string;
  user: {
    nom: string;
    prenom: string;
    email: string;
    role: string;
  };
}

export default function AdminLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // 🔥 Étape 1 : État pour stocker la recherche

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/logs`);
      setLogs(response.data);
    } catch (err: any) {
      console.error("Erreur logs:", err);
      setError('Impossible de récupérer l\'historique des traces d\'audit.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 🔥 Étape 2 : Filtrage dynamique des traces d'audit (Nom, Prénom, Email)
  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true; // Si vide, on affiche tout le monde

    const prenom = (log.user?.prenom || '').toLowerCase();
    const nom = (log.user?.nom || '').toLowerCase();
    const fullName = `${prenom} ${nom}`;
    const email = (log.user?.email || '').toLowerCase();

    return prenom.includes(query) || nom.includes(query) || fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <button 
            onClick={() => router.replace('/dashboard/admin/users')} 
            className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-colors text-xs"
          >
            <ArrowLeft size={16} /> <span>Retour à la gestion des utilisateurs</span>
          </button>

          <button 
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 text-slate-600 hover:text-purple-600 font-bold bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-colors text-xs disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> <span>Actualiser</span>
          </button>
        </div>

        {/* 🔥 Étape 3 : Titre de la page et Barre de Recherche alignés avec Flexbox */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Journal des Traces (Audit Logs)</h1>
            <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">Historique de l'activité et des connexions de la plateforme AuthMassar</p>
          </div>

          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            className="w-full md:max-w-md px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-slate-700 font-medium text-sm focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tableau d'affichage */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b">
                <tr>
                  <th className="px-6 py-4">Date & Heure</th>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Email de connexion</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4 text-right">Action système</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <span className="text-xs font-bold uppercase tracking-wider animate-pulse">Chargement des traces d'audit...</span>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-rose-500 font-bold text-xs uppercase">{error}</td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                      🔍 Aucune trace d'audit trouvée pour "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  /* 🔥 Étape 4 : Remplacement de la boucle pour utiliser filteredLogs */
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        {new Date(log.createdAt).toLocaleString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {log.user?.prenom} {log.user?.nom?.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-semibold">{log.user?.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide ${
                          log.user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          log.user?.role === 'PROFESSEUR' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {log.user?.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black rounded-xl border uppercase tracking-wider shadow-sm ${
                          log.action === 'Saisie des notes' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          log.action === 'Visualisation des notes' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {log.action === 'Saisie des notes' && <FileText size={11} />}
                          {log.action === 'Visualisation des notes' && <Eye size={11} />}
                          {log.action === 'CONNEXION' && <Key size={11} />}
                          <span>{log.action}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}