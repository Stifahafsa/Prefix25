"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import api from "../api"
import Toast from "./Toast"

export default function EventForm({ isOpen, onClose, eventId = null, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [event, setEvent] = useState({
    titre: "",
    type: "spectacle",
    date_debut: "",
    date_fin: "",
    description: "",
    prix: 0,
    espace_id: 1,
  })
  const [spaces, setSpaces] = useState([])

  // Fetch event data if editing
  useEffect(() => {
    if (isOpen && eventId) {
      fetchEvent()
    } else if (isOpen) {
      // Reset form for new event
      setEvent({
        titre: "",
        type: "spectacle",
        date_debut: formatDateForInput(new Date()),
        date_fin: formatDateForInput(new Date(Date.now() + 2 * 60 * 60 * 1000)), // 2 hours later
        description: "",
        prix: 0,
        espace_id: 1,
      })
    }
  }, [isOpen, eventId])

  // Fetch spaces for dropdown
  useEffect(() => {
    if (isOpen) {
      fetchSpaces()
    }
  }, [isOpen])

  const fetchEvent = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/evenements/${eventId}`)
      const eventData = response.data

      // Format dates for input fields
      setEvent({
        ...eventData,
        date_debut: formatDateForInput(new Date(eventData.date_debut)),
        date_fin: formatDateForInput(new Date(eventData.date_fin)),
      })
    } catch (error) {
      console.error("Error fetching event:", error)
      setToast({
        message: "Erreur lors de la récupération de l'événement",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSpaces = async () => {
    try {
      const response = await api.get("/espaces")
      setSpaces(response.data)
    } catch (error) {
      console.error("Error fetching spaces:", error)
      // Use default spaces if API fails
      setSpaces([
        { id: 1, nom: "Salle principale" },
        { id: 2, nom: "Salle d'exposition" },
        { id: 3, nom: "Auditorium" },
        { id: 4, nom: "Salle de conférence" },
      ])
    }
  }

  const formatDateForInput = (date) => {
    return date.toISOString().slice(0, 16)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEvent((prev) => ({
      ...prev,
      [name]: name === "prix" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...event,
        date_debut: new Date(event.date_debut).toISOString(),
        date_fin: new Date(event.date_fin).toISOString(),
      }

      if (eventId) {
        // Update existing event
        await api.put(`/evenements/${eventId}`, payload)
        setToast({
          message: "Événement mis à jour avec succès",
          type: "success",
        })
      } else {
        // Create new event
        await api.post("/evenements", payload)
        setToast({
          message: "Événement créé avec succès",
          type: "success",
        })
      }

      // Call success callback
      if (onSuccess) onSuccess()

      // Close modal after a short delay
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Error saving event:", error)
      setToast({
        message: "Erreur lors de l'enregistrement de l'événement",
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
        title={eventId ? "Modifier l'événement" : "Nouvel événement"}
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
              <label className="block mb-2 text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                name="titre"
                value={event.titre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={event.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              >
                <option value="spectacle">Spectacle</option>
                <option value="atelier">Atelier</option>
                <option value="conference">Conférence</option>
                <option value="exposition">Exposition</option>
                <option value="rencontre">Rencontre</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Date de début</label>
                <input
                  type="datetime-local"
                  name="date_debut"
                  value={event.date_debut}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Date de fin</label>
                <input
                  type="datetime-local"
                  name="date_fin"
                  value={event.date_fin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Espace</label>
              <select
                name="espace_id"
                value={event.espace_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              >
                {spaces.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Prix (MAD)</label>
              <input
                type="number"
                name="prix"
                value={event.prix}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={event.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              ></textarea>
            </div>
          </form>
        )}
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
