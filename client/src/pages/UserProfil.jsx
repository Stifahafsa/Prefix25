import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Cookies from "js-cookie";
import Toast from "../components/Toast";

export default function UserProfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    role: "",
    image_profil: null,
  });
  const [toast, setToast] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const userEmail = Cookies.get("userEmail");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/utilisateurs?email=${userEmail}`);
        const utilisateur = response.data.find(u => u.email === userEmail);
        
        if (!utilisateur) {
          throw new Error("Utilisateur non trouvé");
        }

        setUser(utilisateur);
        setFormData({
          nom: utilisateur.nom || "",
          email: utilisateur.email || "",
          telephone: utilisateur.telephone || "",
          adresse: utilisateur.adresse || "",
          role: utilisateur.role || "",
          image_profil: null,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setToast({
          message: "Erreur lors de la récupération des données utilisateur",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image_profil: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nom", formData.nom);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("telephone", formData.telephone);
      formDataToSend.append("adresse", formData.adresse);
      formDataToSend.append("role", formData.role);

      if (formData.image_profil) {
        formDataToSend.append("image_profil", formData.image_profil);
      }

      await api.put(`/utilisateurs/${user.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setToast({
        message: "Profil mis à jour avec succès",
        type: "success",
      });
      setEditing(false);
      
      // Refetch user data after update
      const response = await api.get(`/utilisateurs?email=${userEmail}`);
      const updatedUser = response.data.find(u => u.email === userEmail);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      setToast({
        message: "Erreur lors de la mise à jour du profil",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="mb-6">Aucun profil utilisateur trouvé.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Retour"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Profil Utilisateur</h1>
        </div>

        {/* Main content */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Profile header with image and name */}
          <div className="relative bg-gradient-to-r from-[oklch(47.3%_0.137_46.201)] to-[oklch(57.3%_0.137_46.201)] h-48">
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                  {editing ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="h-full w-full object-cover"
                        />
                      ) : user.image_profil ? (
                        <img
                          src={user.image_profil}
                          alt={user.nom}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-600 text-3xl font-medium">
                          {user.nom.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <label
                        htmlFor="image_profil"
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <input
                          type="file"
                          id="image_profil"
                          name="image_profil"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : user.image_profil ? (
                    <img
                      src={user.image_profil}
                      alt={user.nom}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-600 text-3xl font-medium">
                      {user.nom.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Edit/Save buttons */}
            <div className="absolute top-4 right-4">
              {editing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        nom: user.nom || "",
                        email: user.email || "",
                        telephone: user.telephone || "",
                        adresse: user.adresse || "",
                        role: user.role || "",
                        image_profil: null,
                      });
                      setImagePreview(null);
                    }}
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-100 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Modifier
                </button>
              )}
            </div>
          </div>

          {/* Profile content */}
          <div className="pt-20 px-8 pb-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  {editing ? (
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{user.nom}</div>
                  )}
                </div>

                {/* Email field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{user.email}</div>
                  )}
                </div>

                {/* Phone field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {user.telephone || "Non renseigné"}
                    </div>
                  )}
                </div>

                {/* Role field - Readonly for non-admins */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                    {user.role === "admin"
                      ? "Administrateur"
                      : user.role === "gestionnaire"
                      ? "Gestionnaire"
                      : "Utilisateur"}
                  </div>
                </div>

                {/* Address field - full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  {editing ? (
                    <textarea
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent"
                    ></textarea>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {user.adresse || "Non renseignée"}
                    </div>
                  )}
                </div>
              </div>

              {/* Account info section */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du compte</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 rounded-full bg-blue-100 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date d'inscription</p>
                        <p className="font-medium">
                          {new Date(user.date_creation).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 rounded-full bg-green-100 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Statut du compte</p>
                        <p className="font-medium">
                          {user.actif ? "Actif" : "Inactif"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}