"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // États du formulaire
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [roleSelectionne, setRoleSelectionne] = useState('ETUDIANT');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Vérification de sécurité (Strictement réservé aux ADMINS)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'ADMIN') {
      router.push('/dashboard'); // On expulse les intrus
    } else {
      setIsLoaded(true);
    }
  }, [router]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // On appelle notre route Back-end
      await axios.post('http://localhost:5000/api/auth/register', {
        nom,
        prenom,
        email,
        motDePasse,
        role: roleSelectionne
      });

      // Message de succès
      setMessage({ type: 'success', text: `Le compte ${roleSelectionne} a été créé avec succès !` });
      
      // On vide le formulaire
      setNom(''); setPrenom(''); setEmail(''); setMotDePasse('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.erreur || "Erreur lors de la création." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-50"></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Bouton Retour */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Retour au tableau de bord</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/60"
        >
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
            <div className="bg-red-100 p-3 rounded-xl text-red-600">
              <UserPlus size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Ajouter un utilisateur</h1>
              <p className="text-slate-500 text-sm mt-1">Créez un accès pour un nouveau Professeur ou Étudiant.</p>
            </div>
          </div>

          {/* Affichage des messages de succès ou d'erreur */}
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{message.text}</span>
            </motion.div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nom</label>
                <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: Alaoui" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Prénom</label>
                <input type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: Karim" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Adresse Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="karim.alaoui@ensa.ma" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mot de passe temporaire</label>
                <input type="text" required value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: pwd123" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Rôle de l'utilisateur</label>
                <select value={roleSelectionne} onChange={(e) => setRoleSelectionne(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700">
                  <option value="ETUDIANT">👨‍🎓 Étudiant</option>
                  <option value="PROFESSEUR">👨‍🏫 Professeur</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full mt-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2">
              {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div> : <UserPlus size={20} />}
              <span>{isLoading ? "Création en cours..." : "Créer le compte"}</span>
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}