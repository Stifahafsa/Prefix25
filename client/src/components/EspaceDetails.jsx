"use client"

import { useState } from "react"
import Modal from "./Modal"
import Toast from "./Toast"

export default function EspaceDetails({ isOpen, onClose, espace, onEdit }) {
  const [toast, setToast] = useState(null)

  const getTypeBadge = (type) => {
    const typeMap = {
      salle: "bg-blue-100 text-blue-800",
      atelier: "bg-green-100 text-green-800",
    }

    const typeText = {
      salle: "Salle",
      atelier: "Atelier",
    }

    const className = typeMap[type] || "bg-gray-100 text-gray-800"
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {typeText[type] || type || "N/A"}
      </span>
    )
  }

  const getSousTypeBadge = (sousType) => {
    if (!sousType) return null

    const sousTypeMap = {
      théâtre: "bg-purple-100 text-purple-800",
      conférence: "bg-yellow-100 text-yellow-800",
      bibliothèque: "bg-indigo-100 text-indigo-800",
      musique: "bg-pink-100 text-pink-800",
      café: "bg-amber-100 text-amber-800",
      photographie: "bg-cyan-100 text-cyan-800",
      informatique: "bg-emerald-100 text-emerald-800",
      langue: "bg-violet-100 text-violet-800",
      arts: "bg-rose-100 text-rose-800",
    }

    const className = sousTypeMap[sousType] || "bg-gray-100 text-gray-800"
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {sousType}
      </span>
    )
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Détails de l'espace"
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
        {espace ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID de l'espace</h3>
                <p className="mt-1 text-sm text-gray-900">{espace.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                <p className="mt-1 flex gap-2">
                  {getTypeBadge(espace.type)}
                  {espace.sous_type && getSousTypeBadge(espace.sous_type)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Nom</h3>
              <p className="mt-1 text-sm text-gray-900">{espace.nom}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Capacité</h3>
              <p className="mt-1 text-sm text-gray-900">{espace.capacite || "Non spécifiée"}</p>
            </div>

            {espace.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{espace.description}</p>
              </div>
            )}

            {espace.image_url && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Image</h3>
                <div className="mt-2 max-w-xs">
                  <img
                    src={espace.image_url || "/placeholder.svg"}
                    alt={espace.nom}
                    className="rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=150&width=250"
                      e.target.alt = "Image non disponible"
                    }}
                  />
                </div>
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