"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import api from "../api"
import Cookies from "js-cookie"
import ReservationForm from "./ReservationForm"
import ReservationDetails from "./ReservationDetails"

export default function ReservationsTable({ limit }) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showReservationDetails, setShowReservationDetails] = useState(false)
  const [editingReservationId, setEditingReservationId] = useState(null)
  const [viewingReservationId, setViewingReservationId] = useState(null)
  const userRole = Cookies.get("userRole")
  const canDelete = userRole === "superadmin"

  useEffect(() => {
    fetchReservations()
  }, [limit])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const response = await api.get("/reservations")
      let data = response.data

      if (limit) {
        data = data.slice(0, limit)
      }

      setReservations(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching reservations:", err)
      setError("Impossible de charger les réservations")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setShowConfirmModal(true)
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/reservations/${selectedId}`)
      setReservations(reservations.filter((reservation) => reservation.id !== selectedId))
      setShowConfirmModal(false)
    } catch (error) {
      console.error("Error deleting reservation:", error)
      setError("Erreur lors de la suppression de la réservation")
    }
  }

  const handleAddReservation = () => {
    setEditingReservationId(null)
    setShowReservationForm(true)
  }

  const handleEditReservation = (id) => {
    setEditingReservationId(id)
    setShowReservationForm(true)
  }

  const handleViewReservation = (id) => {
    setViewingReservationId(id)
    setShowReservationDetails(true)
  }

  const handleReservationFormSuccess = () => {
    fetchReservations()
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
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
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    }

    const statusText = {
      confirme: "Confirmée",
      en_attente: "En attente",
      annule: "Annulée",
      confirmed: "Confirmée",
      pending: "En attente",
      cancelled: "Annulée",
    }

    const className = statusMap[status] || "bg-gray-100 text-gray-800"
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {statusText[status] || status || "N/A"}
      </span>
    )
  }

  // Filter reservations based on search term and status
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      searchTerm === "" ||
      (reservation.evenement_titre && reservation.evenement_titre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reservation.utilisateur_nom && reservation.utilisateur_nom.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "" || reservation.statut === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    )
  }

  if (error && reservations.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p>{error}</p>
      </div>
    )
  }

  if (filteredReservations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Aucune réservation trouvée</p>
        <button
          onClick={handleAddReservation}
          className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
        >
          Nouvelle réservation
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <input
            type="text"
            placeholder="Rechercher..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="confirme">Confirmée</option>
            <option value="en_attente">En attente</option>
            <option value="annule">Annulée</option>
          </select>
        </div>
        {!limit && (
          <button
            onClick={handleAddReservation}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Nouvelle réservation
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {reservation.evenement_titre || reservation.evenement_id || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reservation.utilisateur_nom || reservation.utilisateur_id || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(reservation.date_reservation)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(reservation.statut)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewReservation(reservation.id)}
                    className="text-[oklch(47.3%_0.137_46.201)] hover:text-[oklch(50%_0.137_46.201)] mr-3"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => handleEditReservation(reservation.id)}
                    className="text-amber-600 hover:text-amber-900 mr-3"
                  >
                    Modifier
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteClick(reservation.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmer la suppression"
        footer={
          <>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Supprimer
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
        </p>
      </Modal>

      <ReservationForm
        isOpen={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        reservationId={editingReservationId}
        onSuccess={handleReservationFormSuccess}
      />

      <ReservationDetails
        isOpen={showReservationDetails}
        onClose={() => setShowReservationDetails(false)}
        reservationId={viewingReservationId}
        onEdit={handleEditReservation}
      />
    </>
  )
}
