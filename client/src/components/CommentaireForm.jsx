"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import api from "../api"
import Toast from "./Toast"

export default function CommentaireForm({ isOpen, onClose, commentaire = null, onSuccess, events = [], users = [], evenementId = null }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    contenu: "",
    utilisateur_id: "",
    evenement_id: evenementId || "",
    note: "",
  })

  // Initialize form with commentaire data if editing
  useEffect(() => {
    if (isOpen && commentaire) {
      setFormData({
        contenu: commentaire.contenu || "",
        utilisateur_id: commentaire.utilisateur_id || "",
        evenement_id: commentaire.evenement_id || evenementId || "",
        note: commentaire.note || "",
      })
    } else if (isOpen) {
      // Reset form for new commentaire
      setFormData({
        contenu: "",
        utilisateur_id: "",
        evenement_id: evenementId || "",
        note: "",
      })
    }
  }, [isOpen, commentaire, evenementId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "note" ? (value === "" ? "" : Number.parseInt(value)) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = { ...formData }

      if (commentaire?.id) {
        // Update existing commentaire
        await api.put(`/commentaires/${commentaire.id}`, payload)
        setToast({
          message: "Commentaire mis à jour avec succès",
          type: "success",
        })
      } else {
        // Create new commentaire
        await api.post("/commentaires", payload)
        setToast({
          message: "Commentaire créé avec succès",
          type: "success",
        })
      }

      if (onSuccess) onSuccess()
      setTimeout(() => onClose(), 1500)
    } catch (error) {
      console.error("Error saving commentaire:", error)
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
        title={commentaire?.id ? "Modifier le commentaire" : "Nouveau commentaire"}
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
              <label className="block mb-2 text-sm font-medium text-gray-700">Événement</label>
              <select
                name="evenement_id"
                value={formData.evenement_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
                disabled={!!evenementId}
              >
                <option value="">Sélectionner un événement</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.titre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Utilisateur</label>
              <select
                name="utilisateur_id"
                value={formData.utilisateur_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nom} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Contenu</label>
              <textarea
                name="contenu"
                value={formData.contenu}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              ></textarea>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Note (1-5)</label>
              <select
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              >
                <option value="">Sans note</option>
                <option value="1">1 étoile</option>
                <option value="2">2 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="5">5 étoiles</option>
              </select>
            </div>
          </form>
        )}
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}