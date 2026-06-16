"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, Users, BookOpen, Link } from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [structure, setStructure] = useState<{ filieres: any[]; modules: any[]; matieres: any[] }>({ filieres: [], modules: [], matieres: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Formulaire 1 : Inscription Membre
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [roleForm, setRoleForm] = useState('ETUDIANT');
  const [filiereEtudiant, setFiliereEtudiant] = useState('');

  // Formulaire 2 : Nouvelle Matière (Uniquement avec Filtre de la filière visible)
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
        axios.get('http://localhost:5000/api/auth/users'),
        axios.get('http://localhost:5000/api/auth/academic-structure')
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
      await axios.post('http://localhost:5000/api/auth/register', { 
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
      // On envoie directement le nom et la filière sans bloquer côté client
      await axios.post('http://localhost:5000/api/auth/matieres', { 
        nomMatiere, 
        filiereId: filiereMatiere 
      });
      
      flashMessage(`Matière "${nomMatiere}" ajoutée avec succès !`);
      setNomMatiere('');
      loadPageData(); // Rafraîchit l'annuaire et les sélecteurs
    } catch (err) { 
      flashMessage("Erreur lors de la création de la matière."); 
    }
  };

  const handleAssignation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/users/assign-prof', {
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
        
        <div className="mb-8 flex justify-between items-center">
          <button onClick={() => router.replace('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-colors"><ArrowLeft size={20} /> <span>Retour au Dashboard</span></button>
          {message && <div className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all">{message}</div>}
        </div>

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

          {/* 2. SECTION MATIÈRE ÉPURÉE (Sélecteur de module masqué) */}
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

        {/* RECAPITULATIF : ANNUAIRE */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100"><h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><Users className="text-purple-600" size={22} /> Annuaire et Affectations Récapitulatives</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b">
                <tr><th className="px-6 py-4">Nom & Prénom</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Rôle</th><th className="px-6 py-4">Filière</th><th className="px-6 py-4">Matières Enseignées</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400">Chargement des données du registre...</td></tr>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}