import React, { useEffect, useState } from "react";
import api from "../api";
import Cookies from "js-cookie";

export default function UserProfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userEmail = Cookies.get("userEmail");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/utilisateurs?email=${userEmail}`);
        const utilisateur = response.data.find(u => !u.is_talent);
        setUser(utilisateur);
      } catch (err) {
        setError("Erreur lors du chargement du profil utilisateur.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userEmail]);

  if (loading) return <div>Chargement du profil utilisateur...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return <div>Aucun profil utilisateur trouvé.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Profil Utilisateur</h2>
      <div className="mb-2"><span className="font-semibold">Nom:</span> {user.nom}</div>
      <div className="mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
      <div className="mb-2"><span className="font-semibold">Rôle:</span> {user.role}</div>
    </div>
  );
}