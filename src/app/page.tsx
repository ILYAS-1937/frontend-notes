"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, LogIn } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-4 font-sans relative overflow-hidden">
      
      {/* Halos de lumière en arrière-plan */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl bg-white/70 backdrop-blur-xl p-10 md:p-14 rounded-3xl shadow-2xl border border-white/50 relative z-10 mx-4"
      >
        {/* Logo animé */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg mb-6">
          <GraduationCap size={44} />
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
          Massar Clone
        </h1>
        
        {/* Description */}
        <p className="text-slate-500 text-lg mb-8 font-medium max-w-md mx-auto leading-relaxed">
          La plateforme moderne de gestion de notes et de suivi académique en temps réel.
        </p>

        {/* Bouton d'accès */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/login')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <LogIn size={20} />
          <span>Accéder au Portail</span>
        </motion.button>
      </motion.div>
    </div>
  );
}