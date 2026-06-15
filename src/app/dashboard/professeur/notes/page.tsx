"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ClipboardCheck, Plus, Minus, CheckCircle2, AlertCircle, UserX } from 'lucide-react';

export default function GradebookPage() {
  const router = useRouter();
  
  // États de l'application
  const [classe, setClasse] = useState<any[]>([]);
  const [nomMatiereActive, setNomMatiereActive] = useState<string>('Chargement...'); 
  const [recherche, setRecherche] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // États des identifiants académiques du professeur
  const [profId, setProfId] = useState<string | null>(null);
  const [matiereId, setMatiereId] = useState<number>(1);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    
    // Sécurité anti-session corrompue
    if (!storedId || storedId === "undefined") {
      router.replace('/login');
      return;
    }

    setProfId(storedId);
    fetchClasse(storedId);
  }, [router]);

  const fetchClasse = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/professeur/${id}/resultats`);
      
      // Hydratation de la structure enrichie (matiereId, nomMatiere, etudiants)
      setClasse(res.data.etudiants || []);
      setNomMatiereActive(res.data.nomMatiere || 'Matière Inconnue');
      
      if (res.data.matiereId) {
        setMatiereId(res.data.matiereId);
      }
    } catch (err: any) {
      console.error("Détails de l'erreur lors de l'appel API :", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNote = async (etudiantId: number, type: string, valeur: string) => {
    if (valeur === "") return;
    try {
      await axios.post('http://localhost:5000/api/auth/notes/save-single', {
        valeur,
        typeEvaluation: type,
        etudiantId,
        matiereId: matiereId // Clé unique dynamique affectée
      });
      setLastSaved(`Modifications enregistrées pour ${nomMatiereActive}`);
      setTimeout(() => setLastSaved(null), 2500);
    } catch (err) {
      console.error("Erreur de sauvegarde de la note");
    }
  };

  const ajouterAbsence = async (etudiantId: number) => {
    try {
      await axios.post(`http://localhost:5000/api/auth/absences`, { etudiantId, matiereId: matiereId });
      if (profId) fetchClasse(profId); 
    } catch (err) {
      console.error("Erreur ajout absence");
    }
  };

  const diminuerAbsence = async (etudiantId: number) => {
    try {
      await axios.post(`http://localhost:5000/api/auth/absences/retirer`, { etudiantId, matiereId: matiereId });
      if (profId) fetchClasse(profId); 
    } catch (err) {
      console.error("Erreur retrait absence");
    }
  };

  const etudiantsFiltres = classe.filter(e => 
    `${e.nom} ${e.prenom}`.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Zone Supérieure : Bouton de retour et notification */}
        <div className="mb-10 flex justify-between items-center">
          <button 
            onClick={() => router.replace('/dashboard')} 
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm cursor-pointer z-50 transition-all hover:shadow-md"
          >
            <ArrowLeft size={20} /> <span>Retour au Dashboard</span>
          </button>
          
          {lastSaved && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-sm font-bold text-xs"
            >
              <CheckCircle2 size={16} /> <span>{lastSaved}</span>
            </motion.div>
          )}
        </div>

        {/* Panneau principal de la liste académique */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
        >
          
          {/* En-tête : Titre dynamique basé sur la matière du professeur */}
          <div className="p-8 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-xl text-white shadow-md">
                <ClipboardCheck size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800">Grille d'Évaluation : {nomMatiereActive}</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Saisie des examens et suivi de l'assiduité de votre promotion.</p>
              </div>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un étudiant..." 
                className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 w-full outline-none transition-all text-sm font-medium" 
                value={recherche} 
                onChange={(e) => setRecherche(e.target.value)} 
              />
            </div>
          </div>

          {/* Table d'affichage compact et aligné en colonnes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-black tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5">Liste des Étudiants</th>
                  <th className="px-4 py-5 text-center">CC1 (30%)</th>
                  <th className="px-4 py-5 text-center">TP (20%)</th>
                  <th className="px-4 py-5 text-center">CC2 / Exam (50%)</th>
                  <th className="px-6 py-5 text-center">Volume Horaire Absences</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center text-slate-400 font-medium italic">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Chargement de la promotion en cours...
                    </td>
                  </tr>
                ) : classe.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center px-8">
                      <div className="max-w-md mx-auto flex flex-col items-center">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 mb-4">
                          <UserX size={32} />
                        </div>
                        <h3 className="text-base font-black text-slate-800">Aucun étudiant à afficher</h3>
                        <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed text-center">
                          Vérifiez dans votre panel <strong className="text-purple-600 font-bold">ADMIN</strong> que ce compte enseignant est bien affecté à une filière et une matière active, et que vos élèves appartiennent à cette même filière.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : etudiantsFiltres.map((etudiant) => {
                  const nCC = etudiant.notesRecues?.find((n: any) => n.typeEvaluation === 'CC')?.valeur ?? '';
                  const nTP = etudiant.notesRecues?.find((n: any) => n.typeEvaluation === 'TP')?.valeur ?? '';
                  const nEF = etudiant.notesRecues?.find((n: any) => n.typeEvaluation === 'EXAMEN_FINAL')?.valeur ?? '';
                  const nbAbsences = etudiant.absences?.length || 0;

                  return (
                    <tr key={etudiant.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Avatar & Informations Étudiant */}
                      <td className="px-8 py-4 border-r border-slate-50 bg-slate-50/10">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm shadow-sm border border-blue-100 uppercase">
                            {etudiant.nom[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm uppercase leading-none">{etudiant.nom} {etudiant.prenom}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: #{etudiant.id}</p>
                          </div>
                        </div>
                      </td>
                      
                      {/* Note CC1 */}
                      <td className="px-4 py-4">
                        <input 
                          type="number" step="0.25" min="0" max="20" defaultValue={nCC}
                          onBlur={(e) => saveNote(etudiant.id, 'CC', e.target.value)}
                          placeholder="--" 
                          className="w-20 mx-auto block p-2.5 text-center border border-slate-200 rounded-xl outline-none font-bold text-slate-700 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm" 
                        />
                      </td>

                      {/* Note TP */}
                      <td className="px-4 py-4">
                        <input 
                          type="number" step="0.25" min="0" max="20" defaultValue={nTP}
                          onBlur={(e) => saveNote(etudiant.id, 'TP', e.target.value)}
                          placeholder="--" 
                          className="w-20 mx-auto block p-2.5 text-center border border-slate-200 rounded-xl outline-none font-bold text-slate-700 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm" 
                        />
                      </td>

                      {/* Note Examen (CC2) */}
                      <td className="px-4 py-4 border-r border-slate-50">
                        <input 
                          type="number" step="0.25" min="0" max="20" defaultValue={nEF}
                          onBlur={(e) => saveNote(etudiant.id, 'EXAMEN_FINAL', e.target.value)}
                          placeholder="--" 
                          className="w-20 mx-auto block p-2.5 text-center border border-slate-200 rounded-xl outline-none font-black text-indigo-600 bg-indigo-50/30 border-indigo-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm" 
                        />
                      </td>
                      
                      {/* Gestionnaires d'heures d'absences */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2.5">
                          <button 
                            onClick={() => diminuerAbsence(etudiant.id)} 
                            disabled={nbAbsences === 0} 
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-red-500 hover:border-red-200 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>

                          <span className={`w-14 text-center px-2 py-1 rounded-full text-xs font-black border tracking-wide transition-all ${
                            nbAbsences > 3 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {nbAbsences} h
                          </span>

                          <button 
                            onClick={() => ajouterAbsence(etudiant.id)} 
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-emerald-500 hover:border-emerald-200 transition-all shadow-sm cursor-pointer"
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

          {/* Rappel d'enregistrement automatique */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium flex items-center justify-center gap-1">
            <AlertCircle size={12} className="text-slate-400" /> Les modifications s'enregistrent automatiquement lorsque vous cliquez en dehors d'une case de saisie (onBlur).
          </div>
        </motion.div>

      </div>
    </div>
  );
}