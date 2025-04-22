import React, { useEffect, useState } from "react";
import api from "../api";
import Cookies from "js-cookie";

export default function TalentProfil() {
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userEmail = Cookies.get("userEmail");

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const response = await api.get(`/utilisateurs?email=${userEmail}`);
        const user = response.data.find(u => u.is_talent);
        setTalent(user);
      } catch (err) {
        setError("Erreur lors du chargement du profil talent.");
      } finally {
        setLoading(false);
      }
    };
    fetchTalent();
  }, [userEmail]);

  if (loading) return <div>Chargement du profil talent...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!talent) return <div>Aucun profil talent trouvé.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Profil Talent</h2>
      <div className="mb-2"><span className="font-semibold">Nom:</span> {talent.nom}</div>
      <div className="mb-2"><span className="font-semibold">Email:</span> {talent.email}</div>
      <div className="mb-2"><span className="font-semibold">Domaine artistique:</span> {talent.domaine_artiste}</div>
      <div className="mb-2"><span className="font-semibold">Description:</span> {talent.description_talent}</div>
      <div className="mb-2"><span className="font-semibold">Statut:</span> {talent.statut_talent}</div>
    </div>
  );
}