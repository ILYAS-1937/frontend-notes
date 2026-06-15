"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, BookOpen, Users, FileText, CalendarClock, GraduationCap, ShieldCheck, Settings } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [nom, setNom] = useState<string | null>(null);
  const [prenom, setPrenom] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { 
      router.replace('/login'); 
    } else {
      setRole(localStorage.getItem('role'));
      setNom(localStorage.getItem('nom'));
      setPrenom(localStorage.getItem('prenom'));
      setIsLoaded(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace('/login');
  };

  if (!isLoaded) return <div className="flex justify-center items-center h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header commun */}
        <header className="flex justify-between items-center bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/50 mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><GraduationCap size={24} /></div>
            <h1 className="text-xl font-extrabold text-slate-800">Massar Clone</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer">
            <LogOut size={16} /> <span>Déconnexion</span>
          </button>
        </header>

        <main className="bg-white/80 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-xl border border-white/60">
          <div className="border-b border-slate-100 pb-6 mb-8">
            <h2 className="text-3xl font-black text-slate-800">Bonjour, {prenom} {nom} 👋</h2>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Session : {role}</p>
          </div>

          {/* ================= VUE ADMINISTRATEUR ================= */}
          {role === 'ADMIN' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Carte Gestion des utilisateurs (Option 2) */}
              <div 
                onClick={() => router.push('/dashboard/admin/users')} 
                className="p-6 bg-purple-50/50 border border-purple-100 rounded-2xl cursor-pointer hover:shadow-xl transition-all group"
              >
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-purple-600 mb-4">
                  <Users size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-purple-600">Gérer les accès (Comptes)</h3>
                <p className="text-slate-500 text-sm mt-1">Inscrire de nouveaux étudiants/professeurs et consulter l'annuaire de l'établissement.</p>
              </div>

              {/* Deuxième carte administrative informative */}
              <div className="p-6 bg-slate-50/50 border border-slate-200 rounded-2xl opacity-65">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-slate-500 mb-4">
                  <Settings size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Configuration Structure</h3>
                <p className="text-slate-500 text-sm mt-1">Module d'administration système : gestion des filières et affectations des semestres.</p>
              </div>
            </div>
          )}

          {/* ================= VUE PROFESSEUR ================= */}
          {role === 'PROFESSEUR' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div onClick={() => router.push('/dashboard/professeur/notes')} className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl cursor-pointer hover:shadow-xl transition-all group">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-blue-600 mb-4"><BookOpen size={24} /></div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Grille de notation & Absences</h3>
                <p className="text-slate-500 text-sm mt-1">Saisie rapide et intuitive des examens et de l'assiduité.</p>
              </div>
            </div>
          )}

          {/* ================= VUE ÉTUDIANT ================= */}
          {role === 'ETUDIANT' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div onClick={() => router.push('/dashboard/etudiant/bulletins')} className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl cursor-pointer hover:shadow-xl transition-all group">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-emerald-600 mb-4"><FileText size={24} /></div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Mes Bulletins</h3>
                <p className="text-slate-500 text-sm mt-1">Consultez l'ensemble de vos notes du semestre.</p>
              </div>
              <div onClick={() => router.push('/dashboard/etudiant/absences')} className="p-6 bg-orange-50/50 border border-orange-100 rounded-2xl cursor-pointer hover:shadow-xl transition-all group">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-orange-600 mb-4"><CalendarClock size={24} /></div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">Mes Absences</h3>
                <p className="text-slate-500 text-sm mt-1">Consultez votre volume horaire total d'absences.</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}