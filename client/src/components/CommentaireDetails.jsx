"use client"

import { useState } from "react"
import Modal from "./Modal"
import Toast from "./Toast"

export default function CommentaireDetails({ isOpen, onClose, commentaire, onEdit }) {
  const [toast, setToast] = useState(null)

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

  const getNoteBadge = (note) => {
    if (!note) return null
    
    const noteMap = {
      1: "bg-red-100 text-red-800",
      2: "bg-orange-100 text-orange-800",
      3: "bg-yellow-100 text-yellow-800",
      4: "bg-lime-100 text-lime-800",
      5: "bg-green-100 text-green-800",
    }

    const className = noteMap[note] || "bg-gray-100 text-gray-800"
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {note} {note > 1 ? "étoiles" : "étoile"}
      </span>
    )
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Détails du commentaire"
        footer={
          <>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose()
                onEdit()
              }}
              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)]"
            >
              Modifier
            </button>
          </>
        }
      >
        {commentaire ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID du commentaire</h3>
                <p className="mt-1 text-sm text-gray-900">{commentaire.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                <p className="mt-1 text-sm text-gray-900">{formatDate(commentaire.date_creation)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Événement</h3>
              <p className="mt-1 text-sm text-gray-900">
                {commentaire.evenement_titre || `Événement #${commentaire.evenement_id}`}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Utilisateur</h3>
              <p className="mt-1 text-sm text-gray-900">
                {commentaire.utilisateur_nom || `Utilisateur #${commentaire.utilisateur_id}`}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Note</h3>
              <p className="mt-1">
                {commentaire.note ? getNoteBadge(commentaire.note) : "Sans note"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Contenu</h3>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{commentaire.contenu}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">Aucune information disponible</div>
        )}
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}