"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react';

export default function MesBulletinsPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.replace('/login');
      return;
    }

    const fetchMesNotes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/notes/mes-notes/${userId}`);
        setNotes(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des notes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMesNotes();
  }, [router]);

  // Organiser les notes brutes par ligne (Module / Matière)
  const reconstruireBulletin = () => {
    const bulletin: { [key: string]: { CC?: number; TP?: number; EXAMEN_FINAL?: number; id: number } } = {};

    notes.forEach((n) => {
      const nomMatiere = n.matiere?.nomMatiere || "Matière Inconnue";
      if (!bulletin[nomMatiere]) {
        bulletin[nomMatiere] = { id: n.matiereId };
      }
      bulletin[nomMatiere][n.typeEvaluation as 'CC' | 'TP' | 'EXAMEN_FINAL'] = n.valeur;
    });

    return bulletin;
  };

  // Calcul de la moyenne pondérée (30% CC1, 20% TP, 50% CC2/Examen)
  const calculerMoyenneMatiere = (cc?: number, tp?: number, exam?: number) => {
    if (cc === undefined && tp === undefined && exam === undefined) return null;
    const noteCC = cc ?? 0;
    const noteTP = tp ?? 0;
    const noteExam = exam ?? 0;
    return parseFloat((noteCC * 0.30 + noteTP * 0.20 + noteExam * 0.50).toFixed(2));
  };

  const matieresStructurees = reconstruireBulletin();
  const listeMatieres = Object.keys(matieresStructurees);

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Zone de retour aérée (mb-10) */}
        <div className="mb-10">
          <button 
            onClick={() => router.replace('/dashboard')} 
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer z-50 transition-colors"
          >
            <ArrowLeft size={20} /> <span>Retour au Dashboard</span>
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* En-tête du Relevé Épuré (Indication masquée) */}
          <div className="p-8 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-xl text-white shadow-md">
                <FileSpreadsheet size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800">Relevé de Notes Semestriel</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Suivi global de validation de vos modules d'ingénierie.</p>
              </div>
            </div>
          </div>

          {listeMatieres.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium italic">
              Aucune note n'a encore été délibérée pour ce semestre.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-5">Modules / Matières</th>
                    <th className="px-4 py-5 text-center">CC1 (30%)</th>
                    <th className="px-4 py-5 text-center">TP (20%)</th>
                    <th className="px-4 py-5 text-center">CC2 / Exam (50%)</th>
                    <th className="px-4 py-5 text-center">Moyenne</th>
                    <th className="px-8 py-5 text-center">Résultat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {listeMatieres.map((nomMatiere, index) => {
                    const data = matieresStructurees[nomMatiere];
                    const moyenne = calculerMoyenneMatiere(data.CC, data.TP, data.EXAMEN_FINAL);

                    return (
                      <motion.tr 
                        key={nomMatiere}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/20">
                          {nomMatiere}
                        </td>

                        <td className="px-4 py-5 text-center font-semibold text-slate-700">
                          {data.CC !== undefined ? `${data.CC.toFixed(2)}` : '--'}
                        </td>

                        <td className="px-4 py-5 text-center font-semibold text-slate-700">
                          {data.TP !== undefined ? `${data.TP.toFixed(2)}` : '--'}
                        </td>

                        <td className="px-4 py-5 text-center font-semibold text-slate-700 border-r border-slate-100">
                          {data.EXAMEN_FINAL !== undefined ? `${data.EXAMEN_FINAL.toFixed(2)}` : '--'}
                        </td>

                        <td className="px-4 py-5 text-center font-black text-blue-600 bg-blue-50/30">
                          {moyenne !== null ? `${moyenne.toFixed(2)}` : '--'}
                        </td>

                        <td className="px-8 py-5 text-center">
                          {moyenne !== null ? (
                            moyenne >= 12 ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                                <CheckCircle size={14} /> Validé
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
                                <AlertTriangle size={14} /> Rattrapage
                              </span>
                            )
                          ) : (
                            <span className="text-xs font-medium text-slate-400 italic">En cours</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium">
            Calcul pondéré officiel : (CC1 × 0.3) + (TP × 0.2) + (CC2 × 0.5). Tout module inférieur à 12.00 est soumis aux épreuves de rattrapage.
          </div>
        </motion.div>
      </div>
    </div>
  );
}