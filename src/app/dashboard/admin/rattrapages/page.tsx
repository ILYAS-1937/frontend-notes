"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert, Search, RefreshCw, UserX } from 'lucide-react';

export default function AdminRattrapagesPage() {
  const router = useRouter();
  const [rattrapages, setRattrapages] = useState<any[]>([]);
  const [recherche, setRecherche] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRattrapages();
  }, []);

  const fetchRattrapages = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/rattrapages/liste-globale`);
      setRattrapages(res.data);
    } catch (err) {
      console.error("Erreur de calcul des rattrapages");
    } finally {
      setIsLoading(false);
    }
  };

  const filtrerListe = rattrapages.filter(r => 
    r.etudiantNom.toLowerCase().includes(recherche.toLowerCase()) ||
    r.matiere.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header de retour */}
        <div className="mb-8 flex justify-between items-center">
          <button 
            onClick={() => router.replace('/dashboard')} 
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-colors"
          >
            <ArrowLeft size={20} /> <span>Retour Dashboard</span>
          </button>
          <button 
            onClick={fetchRattrapages} 
            className="p-2.5 bg-white border rounded-xl text-slate-600 hover:text-blue-600 hover:shadow-sm cursor-pointer transition-all"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
        >
          
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500 p-3 rounded-xl text-white shadow-md">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800">Générateur Automatique de Rattrapages</h1>
                <p className="text-slate-400 text-xs font-medium mt-1">Étudiants n'ayant pas atteint le seuil de validation de 12.00/20.</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Filtrer par élève ou cours..." 
                className="pl-9 pr-4 py-2 bg-slate-50 text-sm font-medium border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 w-full md:w-60 transition-all" 
                value={recherche} 
                onChange={(e) => setRecherche(e.target.value)} 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-wider border-b">
                <tr>
                  <th className="px-8 py-4">Étudiant inscrit</th>
                  <th className="px-6 py-4">Filière</th>
                  <th className="px-6 py-4">Module / Matière</th>
                  <th className="px-6 py-4 text-center">Note Obtenue</th>
                  <th className="px-8 py-4 text-center">Statut d'inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-medium">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-16 text-center text-slate-400 italic">Analyse automatique des moyennes pondérées...</td></tr>
                ) : filtrerListe.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center px-8">
                      <div className="flex flex-col items-center max-w-sm mx-auto">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-2">
                          <UserX size={24} />
                        </div>
                        <p className="text-emerald-600 font-bold italic text-center text-xs">
                          Excellent ! Aucun étudiant n'est soumis à la session de rattrapage actuelle.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filtrerListe.map((r) => (
                  <tr key={r.idUnique} className="hover:bg-amber-50/10 transition-colors">
                    <td className="px-8 py-4 font-black text-slate-800 uppercase text-xs tracking-wide">{r.etudiantNom}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-bold">{r.filiere}</td>
                    <td className="px-6 py-4 text-slate-700 text-xs"><span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-bold">{r.matiere}</span></td>
                    <td className="px-6 py-4 text-center text-red-600 font-black bg-red-50/20">{r.moyenneActuelle.toFixed(2)} / 20</td>
                    <td className="px-8 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                        Convocation Générée
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}