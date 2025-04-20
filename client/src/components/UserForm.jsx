"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import api from "../api"
import Toast from "./Toast"

export default function UserForm({ isOpen, onClose, userId = null, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [user, setUser] = useState({
    nom: "",
    email: "",
    password: "",
    role: "utilisateur",
    is_talent: false,
    domaine_artiste: "",
    description_talent: "",
    statut_talent: "en_validation",
  })
  const [showPassword, setShowPassword] = useState(false)

  // Fetch user data if editing
  useEffect(() => {
    if (isOpen && userId) {
      fetchUser()
    } else if (isOpen) {
      // Reset form for new user
      setUser({
        nom: "",
        email: "",
        password: "",
        role: "utilisateur",
        is_talent: false,
        domaine_artiste: "",
        description_talent: "",
        statut_talent: "en_validation",
      })
    }
  }, [isOpen, userId])

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/utilisateurs/${userId}`)
      // Remove password from the form data for security
      const userData = { ...response.data, password: "" }
      setUser(userData)
    } catch (error) {
      console.error("Error fetching user:", error)
      setToast({
        message: "Erreur lors de la récupération de l'utilisateur",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Create a copy of the user object for the API request
      const payload = { ...user }
      
      // If password is empty and we're editing, remove it from the payload
      if (userId && !payload.password) {
        delete payload.password
      }

      if (userId) {
        // Update existing user
        await api.put(`/utilisateurs/${userId}`, payload)
        setToast({
          message: "Utilisateur mis à jour avec succès",
          type: "success",
        })
      } else {
        // Create new user
        await api.post("/utilisateurs", payload)
        setToast({
          message: "Utilisateur créé avec succès",
          type: "success",
        })
      }

      if (onSuccess) onSuccess()
      setTimeout(() => onClose(), 1500)
    } catch (error) {
      console.error("Error saving user:", error)
      setToast({
        message: error.response?.data?.message || "Erreur lors de l'enregistrement",
        type: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={userId ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
        footer={
          <>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={saving}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] disabled:opacity-50"
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center">
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
                  Enregistrement...
                </span>
              ) : (
                "Enregistrer"
              )}
            </button>
          </>
        }
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="nom"
                value={user.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {userId ? "Mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                  required={!userId}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Rôle</label>
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              >
                <option value="utilisateur">Utilisateur</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_talent"
                name="is_talent"
                checked={user.is_talent}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-[oklch(47.3%_0.137_46.201)] focus:ring-[oklch(47.3%_0.137_46.201)]"
              />
              <label htmlFor="is_talent" className="ml-2 block text-sm text-gray-700">
                Est un talent
              </label>
            </div>

            {user.is_talent && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Domaine artistique</label>
                  <input
                    type="text"
                    name="domaine_artiste"
                    value={user.domaine_artiste}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Statut du talent</label>
                  <select
                    name="statut_talent"
                    value={user.statut_talent}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                  >
                    <option value="en_validation">En validation</option>
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Description du talent</label>
                  <textarea
                    name="description_talent"
                    value={user.description_talent}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                  ></textarea>
                </div>
              </>
            )}
          </form>
        )}
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}