"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import api from "../api"
import Toast from "./Toast"

export default function ReservationDetails({ isOpen, onClose, reservationId, onEdit }) {
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (isOpen && reservationId) {
      fetchReservation()
    }
  }, [isOpen, reservationId])

  const fetchReservation = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/reservations/${reservationId}`)
      setReservation(response.data)
    } catch (error) {
      console.error("Error fetching reservation:", error)
      setToast({
        message: "Erreur lors de la récupération des détails de la réservation",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      confirme: "bg-green-100 text-green-800",
      en_attente: "bg-yellow-100 text-yellow-800",
      annule: "bg-red-100 text-red-800",
    }

    const statusText = {
      confirme: "Confirmée",
      en_attente: "En attente",
      annule: "Annulée",
    }

    const className = statusMap[status] || "bg-gray-100 text-gray-800"
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {statusText[status] || status || "N/A"}
      </span>
    )
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Détails de la réservation"
        footer={
          <>
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Fermer
            </button>
            <button
              onClick={() => {
                onClose()
                if (onEdit) onEdit(reservationId)
              }}
              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)]"
            >
              Modifier
            </button>
          </>
        }
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
          </div>
        ) : reservation ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID de réservation</h3>
                <p className="mt-1 text-sm text-gray-900">{reservation.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                <p className="mt-1">{getStatusBadge(reservation.statut)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Événement</h3>
              <p className="mt-1 text-sm text-gray-900">
                {reservation.evenement_titre || `Événement #${reservation.evenement_id}`}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Utilisateur</h3>
              <p className="mt-1 text-sm text-gray-900">
                {reservation.utilisateur_nom || `Utilisateur #${reservation.utilisateur_id}`}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Date de réservation</h3>
              <p className="mt-1 text-sm text-gray-900">{formatDate(reservation.date_reservation)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Nombre de places</h3>
              <p className="mt-1 text-sm text-gray-900">{reservation.nombre_places}</p>
            </div>

            {reservation.date_creation && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                <p className="mt-1 text-sm text-gray-900">{formatDate(reservation.date_creation)}</p>
              </div>
            )}

            {reservation.date_modification && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Dernière modification</h3>
                <p className="mt-1 text-sm text-gray-900">{formatDate(reservation.date_modification)}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">Aucune information disponible</div>
        )}
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
