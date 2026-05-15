"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  BookOpen, 
  Users, 
  FileText, 
  CalendarClock, 
  GraduationCap, 
  UserPlus, 
  Database 
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [nom, setNom] = useState<string | null>(null);       // <-- À AJOUTER
const [prenom, setPrenom] = useState<string | null>(null); // <-- À AJOUTER
  const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userNom = localStorage.getItem('nom');       // <-- À AJOUTER
  const userPrenom = localStorage.getItem('prenom'); // <-- À AJOUTER

  if (!token) {
    router.push('/login');
  } else {
    setRole(userRole);
    setNom(userNom);       // <-- À AJOUTER
    setPrenom(userPrenom); // <-- À AJOUTER
    setIsLoaded(true);
  }
}, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Configuration des animations Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6 md:p-10 font-sans">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        
        {/* En-tête / Navbar */}
        <motion.header 
          variants={itemVariants}
          className="flex justify-between items-center bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/50 mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              Massar Clone
            </h1>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 shadow-sm"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </motion.header>

        {/* Section Principale */}
        <motion.main variants={itemVariants} className="bg-white/80 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-xl border border-white/60">
          
          {/* VUE PROFESSEUR */}
          {role === 'PROFESSEUR' && (
            <div className="space-y-8">
              <div className="border-b border-slate-100 pb-6">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Bonjour, {prenom} {nom} 👋</h2>
                <p className="text-slate-500 mt-2 text-lg">Gérez vos classes, vos notes et le suivi de vos élèves en toute simplicité.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div onClick={() => router.push('/dashboard/professeur/notes')} whileHover={{ scale: 1.03, y: -5 }} className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-blue-200/50 hover:shadow-xl">
                  <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                    <BookOpen size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Saisie des notes</h3>
                  <p className="text-slate-600 text-sm">Ajoutez et modifiez les notes des contrôles continus.</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03, y: -5 }} className="group p-6 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100/50 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-violet-200/50 hover:shadow-xl">
                  <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 text-violet-600 group-hover:scale-110 transition-transform">
                    <Users size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Gestion des absences</h3>
                  <p className="text-slate-600 text-sm">Faites l'appel et suivez l'assiduité de vos classes.</p>
                </motion.div>
              </div>
            </div>
          )}

          {/* VUE ÉTUDIANT */}
          {role === 'ETUDIANT' && (
            <div className="space-y-8">
              <div className="border-b border-slate-100 pb-6">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Bonjour, {prenom} {nom} 👋</h2>
                <p className="text-slate-500 mt-2 text-lg">Consultez vos performances académiques et votre emploi du temps.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div onClick={() => router.push('/dashboard/etudiant/bulletins')} whileHover={{ scale: 1.03, y: -5 }} className="group p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-emerald-200/50 hover:shadow-xl">
                  <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                    <FileText size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Mes Bulletins</h3>
                  <p className="text-slate-600 text-sm">Consultez vos relevés de notes et vos moyennes.</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03, y: -5 }} className="group p-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100/50 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-orange-200/50 hover:shadow-xl">
                  <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 text-orange-600 group-hover:scale-110 transition-transform">
                    <CalendarClock size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Mes Absences</h3>
                  <p className="text-slate-600 text-sm">Vérifiez le récapitulatif de vos retards et absences.</p>
                </motion.div>
              </div>
            </div>
          )}

          {/* VUE ADMINISTRATEUR */}
          {role === 'ADMIN' && (
            <div className="space-y-8">
              <div className="border-b border-slate-100 pb-6">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Bonjour, Administrateur 🛡️</h2>
                <p className="text-slate-500 mt-2 text-lg">Espace de gestion centrale. Supervisez les utilisateurs et la structure académique.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div onClick={() => router.push('/dashboard/admin/users')} whileHover={{ scale: 1.03, y: -5 }} className="group p-6 bg-gradient-to-br from-red-50 to-rose-50 border border-red-100/50 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-red-200/50 hover:shadow-xl">
                  <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 text-red-600 group-hover:scale-110 transition-transform">
                    <UserPlus size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Gérer les accès</h3>
                  <p className="text-slate-600 text-sm">Créer et révoquer les comptes des professeurs et des étudiants.</p>
                </motion.div>

                <motion.div onClick={() => router.push('/dashboard/admin/annuaire')} whileHover={{ scale: 1.03, y: -5 }} className="group p-6 bg-gradient-to-br from-slate-100 to-gray-200 border border-slate-200/50 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-slate-300/50 hover:shadow-xl">
                  <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 text-slate-700 group-hover:scale-110 transition-transform">
                    <Database size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Annuaire des membres</h3>
                  <p className="text-slate-600 text-sm">Configurer les filières, les modules et les matières.</p>
                </motion.div>
              </div>
            </div>
          )}

        </motion.main>
      </motion.div>
    </div>
  );
}