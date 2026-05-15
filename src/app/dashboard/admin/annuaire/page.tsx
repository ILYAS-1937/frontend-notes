"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Search, GraduationCap, BookOpen, ShieldAlert } from 'lucide-react';

// On définit la structure d'un utilisateur tel qu'il vient de la base de données
interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

export default function AnnuairePage() {
  const router = useRouter();
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [recherche, setRecherche] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (localStorage.getItem('role') !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    // Fonction pour aller chercher les utilisateurs dans le Back-end
    const fetchUsers = async () => {
      try {
        const reponse = await axios.get(`http://localhost:5000/api/auth/users`);
        setUtilisateurs(reponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  // Petite fonction sympa pour filtrer la liste en direct quand on tape dans la barre de recherche !
  const utilisateursFiltres = utilisateurs.filter(user => 
    user.nom.toLowerCase().includes(recherche.toLowerCase()) || 
    user.prenom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-6 transition-colors">
          <ArrowLeft size={20} />
          <span>Retour au tableau de bord</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/60">
          
          {/* En-tête avec barre de recherche */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-3 rounded-xl text-white shadow-md">
                <Users size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800">Annuaire de l'école</h1>
                <p className="text-slate-500 text-sm mt-1">Gérez les {utilisateurs.length} membres inscrits.</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Rechercher un nom..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
              />
            </div>
          </div>

          {/* Tableau des utilisateurs */}
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Nom complet</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Rôle</th>
                  </tr>
                </thead>
                <tbody>
                  {utilisateursFiltres.map((user, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                      key={user.id} 
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 font-bold text-slate-800">{user.nom} {user.prenom}</td>
                      <td className="py-4 text-slate-600">{user.email}</td>
                      <td className="py-4">
                        {/* On affiche un joli badge selon le rôle */}
                        {user.role === 'ETUDIANT' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><GraduationCap size={14}/> Étudiant</span>}
                        {user.role === 'PROFESSEUR' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700"><BookOpen size={14}/> Professeur</span>}
                        {user.role === 'ADMIN' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"><ShieldAlert size={14}/> Admin</span>}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {utilisateursFiltres.length === 0 && (
                <p className="text-center py-8 text-slate-500 font-medium">Aucun utilisateur trouvé.</p>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}