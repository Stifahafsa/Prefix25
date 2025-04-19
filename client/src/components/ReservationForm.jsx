"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import api from "../api"
import Toast from "./Toast"

export default function ReservationForm({ isOpen, onClose, reservationId = null, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [reservation, setReservation] = useState({
    evenement_id: "",
    utilisateur_id: "",
    date_reservation: formatDateForInput(new Date()),
    statut: "en_attente",
    nombre_places: 1,
  })
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])

  // Fetch reservation data if editing
  useEffect(() => {
    if (isOpen && reservationId) {
      fetchReservation()
    } else if (isOpen) {
      // Reset form for new reservation
      setReservation({
        evenement_id: "",
        utilisateur_id: "",
        date_reservation: formatDateForInput(new Date()),
        statut: "en_attente",
        nombre_places: 1,
      })
      fetchEvents()
      fetchUsers()
    }
  }, [isOpen, reservationId])

  function formatDateForInput(date) {
    return date.toISOString().slice(0, 16)
  }

  const fetchReservation = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/reservations/${reservationId}`)
      const reservationData = response.data

      // Format date for input field
      setReservation({
        ...reservationData,
        date_reservation: formatDateForInput(new Date(reservationData.date_reservation)),
      })

      // Fetch related data
      fetchEvents()
      fetchUsers()
    } catch (error) {
      console.error("Error fetching reservation:", error)
      setToast({
        message: "Erreur lors de la récupération de la réservation",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await api.get("/evenements")
      setEvents(response.data)
    } catch (error) {
      console.error("Error fetching events:", error)
      setToast({
        message: "Erreur lors de la récupération des événements",
        type: "error",
      })
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get("/utilisateurs")
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setToast({
        message: "Erreur lors de la récupération des utilisateurs",
        type: "error",
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setReservation((prev) => ({
      ...prev,
      [name]: name === "nombre_places" ? Number.parseInt(value, 10) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...reservation,
        date_reservation: new Date(reservation.date_reservation).toISOString(),
      }

      if (reservationId) {
        // Update existing reservation
        await api.put(`/reservations/${reservationId}`, payload)
        setToast({
          message: "Réservation mise à jour avec succès",
          type: "success",
        })
      } else {
        // Create new reservation
        await api.post("/reservations", payload)
        setToast({
          message: "Réservation créée avec succès",
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
      console.error("Error saving reservation:", error)
      setToast({
        message: "Erreur lors de l'enregistrement de la réservation",
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
        title={reservationId ? "Modifier la réservation" : "Nouvelle réservation"}
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
                value={reservation.evenement_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
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
                value={reservation.utilisateur_id}
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
              <label className="block mb-2 text-sm font-medium text-gray-700">Date de réservation</label>
              <input
                type="datetime-local"
                name="date_reservation"
                value={reservation.date_reservation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nombre de places</label>
              <input
                type="number"
                name="nombre_places"
                value={reservation.nombre_places}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Statut</label>
              <select
                name="statut"
                value={reservation.statut}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              >
                <option value="en_attente">En attente</option>
                <option value="confirme">Confirmée</option>
                <option value="annule">Annulée</option>
              </select>
            </div>
          </form>
        )}
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
