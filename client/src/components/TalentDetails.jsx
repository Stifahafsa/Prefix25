"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import api from "../api"
import Toast from "./Toast"

export default function TalentDetails({ isOpen, onClose, talentId, onEdit }) {
  const [loading, setLoading] = useState(true)
  const [talent, setTalent] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (isOpen && talentId) {
      fetchTalent()
    }
  }, [isOpen, talentId])

  const fetchTalent = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/utilisateurs/${talentId}`)
      setTalent(response.data)
    } catch (error) {
      console.error("Error fetching talent:", error)
      setToast({
        message: "Erreur lors de la récupération des détails du talent",
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
    })
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      actif: "bg-green-100 text-green-800",
      inactif: "bg-red-100 text-red-800",
      en_validation: "bg-yellow-100 text-yellow-800",
    }

    const statusText = {
      actif: "Actif",
      inactif: "Inactif",
      en_validation: "En validation",
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
        title="Détails du talent"
        footer={
          <>
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Fermer
            </button>
            <button
              onClick={() => {
                onClose()
                if (onEdit) onEdit(talentId)
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
        ) : talent ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID du talent</h3>
                <p className="mt-1 text-sm text-gray-900">{talent.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                <p className="mt-1">{getStatusBadge(talent.statut_talent)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Nom</h3>
              <p className="mt-1 text-sm text-gray-900">{talent.nom}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-sm text-gray-900">{talent.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Domaine artistique</h3>
              <p className="mt-1 text-sm text-gray-900">{talent.domaine_artiste || "Non spécifié"}</p>
            </div>

            {talent.description_talent && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{talent.description_talent}</p>
              </div>
            )}

            {talent.date_inscription && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date d'inscription</h3>
                <p className="mt-1 text-sm text-gray-900">{formatDate(talent.date_inscription)}</p>
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
