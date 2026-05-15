"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Search, User, ClipboardCheck, Plus, CheckCircle2 } from 'lucide-react';

export default function GradebookPage() {
  const router = useRouter();
  const [classe, setClasse] = useState<any[]>([]);
  const [recherche, setRecherche] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    fetchClasse();
  }, []);

  const fetchClasse = async () => {
    try {
      // On récupère les étudiants de la filière 1 avec leurs notes et absences
      const res = await axios.get('http://localhost:5000/api/auth/filiere/1/resultats');
      setClasse(res.data);
    } catch (err) {
      console.error("Erreur de chargement de la classe");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour sauvegarder une note (Appelée quand on quitte un input)
  const saveNote = async (etudiantId: number, type: string, valeur: string) => {
    if (valeur === "") return;
    try {
      await axios.post('http://localhost:5000/api/auth/notes/save-single', {
        valeur,
        typeEvaluation: type,
        etudiantId,
        matiereId: 1 // Id de la matière React par défaut
      });
      setLastSaved(`Note enregistrée pour l'étudiant #${etudiantId}`);
      setTimeout(() => setLastSaved(null), 2000);
    } catch (err) {
      console.error("Erreur de sauvegarde");
    }
  };

  // Fonction pour ajouter une absence rapidement
  const ajouterAbsence = async (etudiantId: number) => {
    try {
      // On suppose que vous allez créer cette route ou on simule l'ajout
      // await axios.post(`http://localhost:5000/api/auth/absences`, { etudiantId, matiereId: 1 });
      fetchClasse(); // On rafraîchit la liste pour voir le nouveau compteur
    } catch (err) {
      console.error("Erreur absence");
    }
  };

  // Filtrer la liste en direct
  const etudiantsFiltres = classe.filter(e => 
    `${e.nom} ${e.prenom}`.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium">
            <ArrowLeft size={20} /> <span>Retour au Dashboard</span>
          </button>
          
          {lastSaved && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 shadow-sm">
              <CheckCircle2 size={18} />
              <span className="text-sm font-bold">Synchronisé</span>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-8 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <ClipboardCheck className="text-blue-600" size={32} /> 
                Grille de Notation : Génie Informatique
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">Les notes sont sauvegardées automatiquement lorsque vous changez de case.</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Chercher un étudiant..." 
                className="pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 w-full md:w-64 outline-none transition-all border"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-8 py-5">Étudiant</th>
                  <th className="px-4 py-5 text-center">CC</th>
                  <th className="px-4 py-5 text-center">TP</th>
                  <th className="px-4 py-5 text-center">Examen</th>
                  <th className="px-4 py-5 text-center">Absences</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">Chargement de la liste...</td></tr>
                ) : etudiantsFiltres.map((etudiant) => {
                  // Extraction des notes existantes
                  const nCC = etudiant.notesRecues?.find((n: any) => n.typeEvaluation === 'CC')?.valeur ?? '';
                  const nTP = etudiant.notesRecues?.find((n: any) => n.typeEvaluation === 'TP')?.valeur ?? '';
                  const nEF = etudiant.notesRecues?.find((n: any) => n.typeEvaluation === 'EXAMEN_FINAL')?.valeur ?? '';

                  return (
                    <tr key={etudiant.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-inner">
                            {etudiant.nom[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-none">{etudiant.nom} {etudiant.prenom}</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest italic">CNE: 202600{etudiant.id}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <input 
                          type="number" step="0.25" min="0" max="20" defaultValue={nCC}
                          onBlur={(e) => saveNote(etudiant.id, 'CC', e.target.value)}
                          placeholder="--" 
                          className="w-16 mx-auto block p-2 text-center border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-bold transition-all" 
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input 
                          type="number" step="0.25" min="0" max="20" defaultValue={nTP}
                          onBlur={(e) => saveNote(etudiant.id, 'TP', e.target.value)}
                          placeholder="--" 
                          className="w-16 mx-auto block p-2 text-center border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-bold transition-all" 
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input 
                          type="number" step="0.25" min="0" max="20" defaultValue={nEF}
                          onBlur={(e) => saveNote(etudiant.id, 'EXAMEN_FINAL', e.target.value)}
                          placeholder="--" 
                          className="w-16 mx-auto block p-2 text-center border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none font-black text-indigo-600 bg-indigo-50/30 transition-all" 
                        />
                      </td>
                      
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black border ${etudiant.absences?.length > 3 ? 'bg-red-100 text-red-600 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {etudiant.absences?.length || 0} h
                          </span>
                          <button 
                            onClick={() => ajouterAbsence(etudiant.id)}
                            className="p-1 bg-white border border-slate-200 text-slate-400 rounded-md hover:text-red-500 hover:border-red-200 transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
            <p>Astuce : Utilisez la touche <kbd className="bg-white border rounded px-1 shadow-sm font-sans">TAB</kbd> pour passer rapidement à la case suivante.</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Système de synchronisation actif
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}