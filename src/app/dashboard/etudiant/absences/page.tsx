"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarClock, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

export default function MesAbsencesPage() {
  const router = useRouter();
  const [absences, setAbsences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) { 
      router.replace('/login'); 
      return; 
    }

    const fetchMesAbsences = async () => {
      try {
        const reponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/absences/mes-absences/${userId}`);
        setAbsences(reponse.data);
      } catch (error) { 
        console.error("Erreur de chargement"); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchMesAbsences();
  }, [router]);

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.replace('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-6 cursor-pointer"><ArrowLeft size={20} /> <span>Retour</span></button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/60">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><CalendarClock size={28} /></div>
              <div>
                <h1 className="text-2xl font-black text-slate-800">Registre d'Assiduité</h1>
                <p className="text-slate-500 text-sm mt-1">Vos absences enregistrées par vos professeurs.</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-100 px-5 py-3 rounded-2xl text-center">
              <p className="text-2xl font-black text-red-600 leading-none">{absences.length} h</p>
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">Total Absences</p>
            </div>
          </div>

          {absences.length === 0 ? (
            <div className="text-center py-10 text-emerald-600 font-medium flex flex-col items-center gap-2"><ShieldCheck size={40} /> <span>Félicitations, aucune absence enregistrée !</span></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="pb-4">Matière</th>
                    <th className="pb-4">Date du relevé</th>
                    <th className="pb-4 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {absences.map((abs) => (
                    <tr key={abs.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-bold text-slate-800">{abs.matiere?.nomMatiere || "React.js"}</td>
                      <td className="py-4 text-slate-600 text-sm">{new Date(abs.dateAbsence).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</td>
                      
                      <td className="py-4 text-center">
                        {abs.justifiee ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold">
                            <CheckCircle size={12} />
                            Justifiée
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-bold">
                            <AlertCircle size={12} />
                            Non justifiée
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}