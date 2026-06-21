"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, UserPlus, Users, BookOpen, Link, Eye, ClipboardList } from 'lucide-react';

/* ==========================================================================
   COMPOSANT MODAL : SUPERVISION DU PROFIL (ÉTUDIANT / PROFESSEUR / ADMIN)
   ========================================================================== */
interface ProfileModalProps {
  userId: number;
  onClose: () => void;
}

function ProfileModal({ userId, onClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/${userId}/profile`);
        setProfile(response.data);
      } catch (err) {
        console.error("Erreur profil:", err);
        setError("Impossible de charger le dossier de l'utilisateur.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider animate-pulse">Chargement du dossier scolaire...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm text-center space-y-4">
        <p className="text-sm font-bold text-red-500">{error}</p>
        <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all">Fermer</button>
      </div>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 rounded-t-3xl">
          <div>
            <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full mb-2 inline-block ${
              profile.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
              profile.role === 'PROFESSEUR' ? 'bg-blue-100 text-blue-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              Fiche Utilisateur : {profile.role}
            </span>
            <h2 className="text-xl font-black text-slate-800">{profile.prenom} {profile.nom.toUpperCase()}</h2>
            <p className="text-xs font-medium text-slate-500">{profile.email}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-semibold bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer">&times;</button>
        </div>

        {/* Corps du Modal */}
        <div className="p-6 space-y-6">
          
          {/* 🎓 DOSSIER ÉTUDIANT */}
          {profile.role === 'ETUDIANT' && (
            <>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-sm font-bold flex justify-between items-center">
                <span>🎓 Filière actuelle :</span>
                <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-xl shadow-sm">{profile.filiere?.nomFiliere || 'Génie Informatique'}</span>
              </div>

              {/* Tableau des Notes */}
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 mb-3 tracking-wider">📊 Relevé de Notes</h3>
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                        <th className="p-3 px-4">Matière</th>
                        <th className="p-3">Évaluation</th>
                        <th className="p-3 text-right px-4">Note / 20</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {profile.notesRecues.length === 0 ? (
                        <tr><td colSpan={3} className="p-6 text-center text-slate-400 text-xs">Aucune note enregistrée dans le système.</td></tr>
                      ) : (
                        profile.notesRecues.map((n: any) => (
                          <tr key={n.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-3 px-4 font-bold text-slate-800">{n.matiere.nomMatiere}</td>
                            <td className="p-3"><span className="text-[10px] uppercase bg-slate-100 text-slate-600 font-black px-2 py-0.5 rounded">{n.typeEvaluation}</span></td>
                            <td className={`p-3 text-right px-4 font-black text-sm ${n.valeur >= 12 ? 'text-emerald-600' : 'text-rose-500'}`}>{n.valeur.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Historique des Absences */}
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 mb-3 tracking-wider">⚠️ Suivi des Absences</h3>
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                        <th className="p-3 px-4">Matière</th>
                        <th className="p-3">Saisie le</th>
                        <th className="p-3 text-right px-4">Statut de l'absence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {profile.absences.length === 0 ? (
                        <tr><td colSpan={3} className="p-6 text-center text-emerald-600 text-xs font-bold">Assiduité parfaite, aucune absence enregistrée ! 🎉</td></tr>
                      ) : (
                        profile.absences.map((a: any) => (
                          <tr key={a.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-3 px-4 font-bold text-slate-800">{a.matiere.nomMatiere}</td>
                            <td className="p-3 text-slate-500 text-xs">{new Date(a.dateAbsence).toLocaleDateString('fr-FR')}</td>
                            <td className="p-3 text-right px-4">
                              <span className={`px-2.5 py-0.5 text-[10px] font-black rounded border ${
                                a.justifiee ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                              }`}>
                                {a.justifiee ? 'JUSTIFIÉE' : 'NON JUSTIFIÉE'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* 👨‍🏫 DOSSIER PROFESSEUR */}
          {profile.role === 'PROFESSEUR' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">👨‍🏫 Affectation Pédagogique Actuelle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-150 rounded-2xl bg-slate-50/50">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Matière Enseignée</p>
                  <p className="text-base font-black text-slate-800 mt-1">
                    {profile.matieresEnseignees[0]?.nomMatiere || "Aucune matière assignée pour le moment"}
                  </p>
                </div>
                <div className="p-4 border border-slate-150 rounded-2xl bg-slate-50/50">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Filière d'Intervention</p>
                  <p className="text-base font-black text-slate-800 mt-1">
                    {profile.matieresEnseignees[0]?.module?.semestre?.filiere?.nomFiliere || "Aucune filière configurée"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 🛡️ DOSSIER ADMIN */}
          {profile.role === 'ADMIN' && (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50/50 space-y-2">
              <p className="text-2xl">🛡️</p>
              <p className="text-sm font-black text-slate-700">Compte Administrateur Global</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Ce compte dispose d'un pouvoir de supervision totale sur la base de données Aiven et sur l'ensemble de la structure académique.</p>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

/* ==========================================================================
   COMPOSANT PRINCIPAL : PANNEAU ADMIN GESTION COMMANDE & ANNUAIRE
   ========================================================================== */
export default function AdminUsersPage() {
  const router = useRouter();
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [structure, setStructure] = useState<{ filieres: any[]; modules: any[]; matieres: any[] }>({ filieres: [], modules: [], matieres: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // 🔥 State pour le modal de supervision

  // Formulaire 1 : Inscription Membre
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [roleForm, setRoleForm] = useState('ETUDIANT');
  const [filiereEtudiant, setFiliereEtudiant] = useState('');

  // Formulaire 2 : Nouvelle Matière
  const [nomMatiere, setNomMatiere] = useState('');
  const [filiereMatiere, setFiliereMatiere] = useState('');

  // Formulaire 3 : Affectation Professeur
  const [selectedProfId, setSelectedProfId] = useState('');
  const [selectedFiliereId, setSelectedFiliereId] = useState('');
  const [selectedMatiereId, setSelectedMatiereId] = useState('');
  
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const [resUsers, resStructure] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/academic-structure`)
      ]);
      setUtilisateurs(resUsers.data);
      setStructure(resStructure.data);
      
      const profs = resUsers.data.filter((u: any) => u.role === 'PROFESSEUR');
      if (profs.length > 0) setSelectedProfId(profs[0].id.toString());
      
      if (resStructure.data.filieres.length > 0) {
        const idInit = resStructure.data.filieres[0].id.toString();
        setSelectedFiliereId(idInit);
        setFiliereEtudiant(idInit);
        setFiliereMatiere(idInit); 
      }
      
      if (resStructure.data.matieres.length > 0) setSelectedMatiereId(resStructure.data.matieres[0].id.toString());

    } catch (err) {
      console.error("Erreur de chargement des données de l'administration");
    } finally {
      setIsLoading(false);
    }
  };

  const flashMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, { 
        nom, 
        prenom, 
        email, 
        motDePasse, 
        role: roleForm,
        filiereId: roleForm === 'ETUDIANT' ? filiereEtudiant : null 
      });
      flashMessage("Compte créé avec succès !");
      setNom(''); setPrenom(''); setEmail(''); setMotDePasse('');
      loadPageData();
    } catch (err) { flashMessage("Erreur d'inscription."); }
  };

  const handleCreateMatiere = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/matieres`, { 
        nomMatiere, 
        filiereId: filiereMatiere 
      });
      
      flashMessage(`Matière "${nomMatiere}" ajoutée avec succès !`);
      setNomMatiere('');
      loadPageData();
    } catch (err) { 
      flashMessage("Erreur lors de la création de la matière."); 
    }
  };

  const handleAssignation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/assign-prof`, {
        professeurId: selectedProfId,
        filiereId: selectedFiliereId,
        matiereId: selectedMatiereId
      });
      flashMessage("Professeur affecté avec succès !");
      loadPageData();
    } catch (err) { flashMessage("Erreur d'affectation."); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* BOUTONS DE NAVIGATION DU HEADER */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-3">
            <button 
              onClick={() => router.replace('/dashboard')} 
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-colors text-xs"
            >
              <ArrowLeft size={16} /> <span>Retour au Dashboard</span>
            </button>
            
            {/* 🔥 BOUTON D'ACCÈS POUR LES LOGS D'AUDIT */}
            <button 
              onClick={() => router.push('/dashboard/admin/logs')} 
              className="flex items-center gap-2 text-purple-600 hover:text-white hover:bg-purple-600 font-bold bg-white px-4 py-2 rounded-xl border border-purple-200 shadow-sm cursor-pointer transition-all text-xs"
            >
              <ClipboardList size={16} /> <span>Journal des Traces</span>
            </button>
          </div>
          
          {message && <div className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all">{message}</div>}
        </div>

        {/* GRILLE DES 3 PANNEAUX DE CONFIGURATION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
          
          {/* 1. SECTEUR COMPTES */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b pb-2 uppercase text-purple-600"><UserPlus size={18} /> 1. Comptes</h2>
            <form onSubmit={handleRegister} className="space-y-3 text-xs font-bold text-slate-500">
              <input type="text" required placeholder="Prénom" className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none text-slate-700 font-medium text-sm" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
              <input type="text" required placeholder="Nom" className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none text-slate-700 font-medium text-sm" value={nom} onChange={(e) => setNom(e.target.value)} />
              <input type="email" required placeholder="email@ensa.ma" className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none text-slate-700 font-medium text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" required placeholder="Mot de passe" className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none text-slate-700 font-medium text-sm" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />
              
              <div>
                <label className="mb-1 block">Rôle de l'utilisateur</label>
                <select className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-700 text-sm font-medium" value={roleForm} onChange={(e) => setRoleForm(e.target.value)}>
                  <option value="ETUDIANT">🎓 ÉTUDIANT</option>
                  <option value="PROFESSEUR">👨‍🏫 PROFESSEUR</option>
                  <option value="ADMIN">🛡️ ADMIN</option>
                </select>
              </div>

              {roleForm === 'ETUDIANT' && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="mb-1 block text-purple-600">Affecter à la filière</label>
                  <select className="w-full px-3 py-2 bg-purple-50/50 border border-purple-100 rounded-xl text-purple-900 font-black text-xs" value={filiereEtudiant} onChange={(e) => setFiliereEtudiant(e.target.value)}>
                    {structure.filieres.map((f) => (
                      <option key={f.id} value={f.id}>{f.nomFiliere}</option>
                    ))}
                  </select>
                </motion.div>
              )}

              <button type="submit" className="w-full py-2.5 bg-purple-600 text-white rounded-xl cursor-pointer hover:bg-purple-700 font-bold mt-2 transition-all">Créer l'utilisateur</button>
            </form>
          </div>

          {/* 2. SECTION MATIÈRE */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b pb-2 uppercase text-purple-600"><BookOpen size={18} /> 2. Matière</h2>
            <form onSubmit={handleCreateMatiere} className="space-y-3 text-xs font-bold text-slate-500">
              <div>
                <label className="mb-1 block">Nom de la matière</label>
                <input type="text" required placeholder="Ex: PHP / Laravel" className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none text-slate-700 font-medium text-sm focus:ring-1 focus:ring-purple-500" value={nomMatiere} onChange={(e) => setNomMatiere(e.target.value)} />
              </div>
              
              <div>
                <label className="mb-1 block text-purple-600">Sélectionner la filière cible</label>
                <select className="w-full px-3 py-2 bg-purple-50/50 border border-purple-100 rounded-xl text-purple-900 font-black text-xs" value={filiereMatiere} onChange={(e) => setFiliereMatiere(e.target.value)}>
                  {structure.filieres.map((f) => (
                    <option key={f.id} value={f.id}>{f.nomFiliere}</option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 font-bold transition-all mt-4">Créer la matière</button>
            </form>
          </div>

          {/* 3. AFFECTATION DES ENSEIGNANTS */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b pb-2 uppercase text-purple-600"><Link size={18} /> 3. Affectation Profs</h2>
            <form onSubmit={handleAssignation} className="space-y-3 text-xs font-bold text-slate-500">
              <div>
                <label className="mb-1 block">Enseignant</label>
                <select className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-700 text-sm font-medium" value={selectedProfId} onChange={(e) => setSelectedProfId(e.target.value)}>
                  {utilisateurs.filter(u => u.role === 'PROFESSEUR').map((p) => (
                    <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block">Filière</label>
                <select className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-700 text-sm font-medium" value={selectedFiliereId} onChange={(e) => setSelectedFiliereId(e.target.value)}>
                  {structure.filieres.map((f) => (
                    <option key={f.id} value={f.id}>{f.nomFiliere}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block">Matière attribuée</label>
                <select className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-700 text-sm font-medium" value={selectedMatiereId} onChange={(e) => setSelectedMatiereId(e.target.value)}>
                  {structure.matieres.map((mat) => (
                    <option key={mat.id} value={mat.id}>{mat.nomMatiere}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 bg-purple-600 text-white rounded-xl cursor-pointer hover:bg-purple-700 font-bold transition-all mt-2">Affecter le professeur</button>
            </form>
          </div>

        </div>

        {/* RECAPITULATIF : ANNUAIRE AVEC ACTION DE SUPERVISION */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
          <div className="p-6 border-b border-slate-100"><h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><Users className="text-purple-600" size={22} /> Annuaire et Affectations Récapitulatives</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b">
                <tr>
                  <th className="px-6 py-4">Nom & Prénom</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Filière</th>
                  <th className="px-6 py-4">Matières Enseignées</th>
                  <th className="px-6 py-4 text-right">Actions</th> {/* 🔥 Nouvelle Colonne */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {isLoading ? (
                  <tr><td colSpan={6} className="py-10 text-center text-slate-400">Chargement des données du registre...</td></tr>
                ) : utilisateurs.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-800">{u.prenom} {u.nom}</td>
                    <td className="px-6 py-3.5 text-slate-500">{u.email}</td>
                    <td className="px-6 py-3.5"><span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : u.role === 'PROFESSEUR' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{u.role}</span></td>
                    <td className="px-6 py-3.5 text-slate-600 text-xs font-bold">{u.filiere?.nomFiliere || '--'}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {u.matieresEnseignees && u.matieresEnseignees.length > 0 ? u.matieresEnseignees.map((m: any) => (
                          <span key={m.id} className="text-blue-600 text-xs font-black bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{m.nomMatiere}</span>
                        )) : <span className="text-slate-400">--</span>}
                      </div>
                    </td>
                    {/* 🔥 CELLULE DE BOUTON : DÉCLENCHEUR DU PROFILE MODAL */}
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedUserId(u.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-purple-600 text-slate-700 hover:text-white text-xs font-bold rounded-xl border border-slate-200 hover:border-purple-600 transition-all cursor-pointer shadow-sm"
                      >
                        <Eye size={12} />
                        <span>Voir Profil</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 🔥 RENDU ANCILLAIRE : AFFICHAGE CONDITIONNEL DU MODAL DE SUPERVISION */}
      <AnimatePresence>
        {selectedUserId && (
          <ProfileModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}