"use client";

import { useState, useEffect } from "react";
import api from "../api";
import Modal from "./Modal";
import Toast from "./Toast";

export default function UserForm({ isOpen, onClose, userId, onSuccess }) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    role: "utilisateur",
    is_talent: false,
    // Champs spécifiques aux talents
    domaine: "",
    experience: "",
    portfolio: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isTalent, setIsTalent] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUser();
    } else {
      setFormData({
        nom: "",
        email: "",
        password: "",
        role: "utilisateur",
        is_talent: false,
        domaine: "",
        experience: "",
        portfolio: "",
      });
      setIsTalent(false);
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/utilisateurs/${userId}`);
      const user = response.data;
      setFormData({
        nom: user.nom || "",
        email: user.email || "",
        password: "",
        role: user.role || "utilisateur",
        is_talent: user.is_talent || false,
        domaine: user.domaine || "",
        experience: user.experience || "",
        portfolio: user.portfolio || "",
      });
      setIsTalent(user.is_talent || false);
    } catch (error) {
      console.error("Error fetching user:", error);
      setToast({
        message: "Erreur lors du chargement de l'utilisateur",
        type: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTalentChange = (e) => {
    const isChecked = e.target.checked;
    setIsTalent(isChecked);
    setFormData({
      ...formData,
      is_talent: isChecked,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = "Le nom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Email invalide";
    if (!userId && !formData.password)
      newErrors.password = "Le mot de passe est requis";
    if (isTalent) {
      if (!formData.domaine) newErrors.domaine = "Le domaine est requis";
      if (!formData.experience)
        newErrors.experience = "L'expérience est requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = {
        nom: formData.nom,
        email: formData.email,
        role: formData.role,
        is_talent: isTalent,
        ...(formData.password && { password: formData.password }),
        ...(isTalent && {
          domaine: formData.domaine,
          experience: formData.experience,
          portfolio: formData.portfolio,
        }),
      };

      if (userId) {
        await api.put(`/utilisateurs/${userId}`, userData);
        setToast({
          message: "Utilisateur mis à jour avec succès",
          type: "success",
        });
      } else {
        await api.post("/utilisateurs", userData);
        setToast({
          message: "Utilisateur créé avec succès",
          type: "success",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      let message = "Une erreur est survenue";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      setToast({
        message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={userId ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                En cours...
              </span>
            ) : userId ? (
              "Mettre à jour"
            ) : (
              "Créer"
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.nom ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.nom && (
            <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
            {userId && (
              <span className="text-xs text-gray-500 ml-1">
                (Laisser vide pour ne pas changer)
              </span>
            )}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rôle
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="utilisateur">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_talent"
            name="is_talent"
            checked={isTalent}
            onChange={handleTalentChange}
            className="h-4 w-4 text-[oklch(47.3%_0.137_46.201)] focus:ring-[oklch(47.3%_0.137_46.201)] border-gray-300 rounded"
          />
          <label
            htmlFor="is_talent"
            className="ml-2 block text-sm text-gray-900"
          >
            Est un talent
          </label>
        </div>

        {isTalent && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domaine
              </label>
              <input
                type="text"
                name="domaine"
                value={formData.domaine}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.domaine ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.domaine && (
                <p className="mt-1 text-sm text-red-600">{errors.domaine}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expérience
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.experience ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio (URL)
              </label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </form>
    </Modal>
  );
}