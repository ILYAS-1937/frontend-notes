"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Award } from 'lucide-react';

export default function MesBulletinsPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (role !== 'ETUDIANT') {
      router.push('/dashboard');
      return;
    }

    const fetchMesNotes = async () => {
      try {
        // On utilise les backticks pour l'interpolation de la variable userId
        const reponse = await axios.get(`http://localhost:5000/api/auth/notes/mes-notes/${userId}`);
        setNotes(reponse.data);
      } catch (error) {
        console.error("Impossible de récupérer les notes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMesNotes();
  }, [router]);

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-6 transition-colors">
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/60">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Mon Bulletin de Notes</h1>
              <p className="text-slate-500 text-sm mt-1">Consultez vos résultats académiques par matière.</p>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-medium">Vous n'avez pas encore de notes saisies.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note, index) => (
                <motion.div 
                  key={note.id} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">{note.typeEvaluation}</span>
                    <Award size={20} className="text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{note.matiere?.nomMatiere || "Matière Inconnue"}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-emerald-600">{note.valeur}</span>
                    <span className="text-slate-400 font-medium pb-1">/ 20</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}