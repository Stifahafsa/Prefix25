"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import api from "../api"
import Cookies from "js-cookie"
import UserForm from "./UserForm"
import UserDetails from "./UserDetails"
import Toast from "./Toast"

export default function UsersTable({ limit }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [showUserForm, setShowUserForm] = useState(false)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [viewingUserId, setViewingUserId] = useState(null)
  const [toast, setToast] = useState(null)
  const userRole = Cookies.get("userRole")
  const canDelete = userRole === "superadmin"

  useEffect(() => {
    fetchUsers()
  }, [limit])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get("/utilisateurs")
      let data = response.data

      if (limit) {
        data = data.slice(0, limit)
      }

      setUsers(data)
      setError(null)
      setToast({
        message: "Utilisateurs chargés avec succès",
        type: "success",
      })
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Impossible de charger les utilisateurs")
      setToast({
        message: "Erreur lors du chargement des utilisateurs",
        type: "error",
      })
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
      await api.delete(`/utilisateurs/${selectedId}`)
      setUsers(users.filter((user) => user.id !== selectedId))
      setShowConfirmModal(false)
      setToast({
        message: "Utilisateur supprimé avec succès",
        type: "success",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      setError("Erreur lors de la suppression de l'utilisateur")
      setToast({
        message: "Erreur lors de la suppression",
        type: "error",
      })
    }
  }

  const handleAddUser = () => {
    setEditingUserId(null)
    setShowUserForm(true)
  }

  const handleEditUser = (id) => {
    setEditingUserId(id)
    setShowUserForm(true)
  }

  const handleViewUser = (id) => {
    setViewingUserId(id)
    setShowUserDetails(true)
  }

  const handleUserFormSuccess = () => {
    fetchUsers()
  }

  const getRoleBadge = (role) => {
    const roleMap = {
      utilisateur: "bg-blue-100 text-blue-800",
      admin: "bg-purple-100 text-purple-800",
      superadmin: "bg-red-100 text-red-800",
    }

    const roleText = {
      utilisateur: "Utilisateur",
      admin: "Admin",
      superadmin: "Super Admin",
    }

    const className = roleMap[role] || "bg-gray-100 text-gray-800"
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {roleText[role] || role || "N/A"}
      </span>
    )
  }

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      (user.nom && user.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRole = roleFilter === "" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    )
  }

  if (error && users.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p>{error}</p>
      </div>
    )
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Aucun utilisateur trouvé</p>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
        >
          Ajouter un utilisateur
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            <option value="utilisateur">Utilisateur</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>
        {!limit && (
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Ajouter un utilisateur
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewUser(user.id)}
                    className="text-[oklch(47.3%_0.137_46.201)] hover:text-[oklch(50%_0.137_46.201)] mr-3"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="text-amber-600 hover:text-amber-900 mr-3"
                  >
                    Modifier
                  </button>
                  {canDelete && user.id !== parseInt(Cookies.get("userId"), 10) && (
                    <button onClick={() => handleDeleteClick(user.id)} className="text-red-600 hover:text-red-900">
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
          Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
        </p>
      </Modal>

      <UserForm
        isOpen={showUserForm}
        onClose={() => setShowUserForm(false)}
        userId={editingUserId}
        onSuccess={handleUserFormSuccess}
      />

      <UserDetails
        isOpen={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        userId={viewingUserId}
        onEdit={handleEditUser}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}