"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api";
import Cookies from "js-cookie";
import EventForm from "./EventForm";
import EventDetails from "./EventDetails";
import Toast from "./Toast";

export default function EventsTable({ limit }) {
  const [events, setEvents] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const userRole = Cookies.get("userRole");
  const canDelete = userRole === "superadmin";

  useEffect(() => {
    fetchAllData();
  }, [limit]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel, updating the events query to expand space information
      const [eventsRes, spacesRes] = await Promise.all([
        api.get("/evenements?_expand=espace"),
        api.get("/espaces"),
      ]);
      
      // Combine event data with space names
      const eventsWithSpaceNames = eventsRes.data.map(event => ({
        ...event,
        espace_nom: event.espace?.nom || `Espace #${event.espace_id}`
      }));
      
      setEvents(eventsWithSpaceNames);
      setSpaces(spacesRes.data);
      setError(null);
      setToast({ message: "Evenements chargées avec succès", type: "success" });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Impossible de charger les données");
      setToast({ message: "Erreur lors du chargement des données", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getSpaceName = (spaceId) => {
    const space = spaces.find((s) => s.id === spaceId);
    return space ? space.nom : "N/A";
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/evenements");
      let data = response.data;

      if (limit) {
        data = data.slice(0, limit);
      }

      setEvents(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Impossible de charger les événements");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/evenements/${selectedId}`);
      setEvents(events.filter((event) => event.id !== selectedId));
      setShowConfirmModal(false);
      setToast({ message: "Événement supprimé avec succès", type: "success" });
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Erreur lors de la suppression de l'événement");
      setToast({ message: "Erreur lors de la suppression", type: "error" });
    }
  };
  
  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };
  
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleViewEvent = (event) => {
    // No need to enhance event with space name anymore since it's already included
    setViewingEvent(event);
    setShowEventDetails(true);
  };

  const handleEventFormSuccess = () => {
    fetchAllData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      spectacle: "bg-pink-100 text-pink-800",
      atelier: "bg-green-100 text-green-800",
      conference: "bg-yellow-100 text-yellow-800",
      exposition: "bg-blue-100 text-blue-800",
      rencontre: "bg-purple-100 text-purple-800",
    };

    const typeText = {
      spectacle: "Spectacle",
      atelier: "Atelier",
      conference: "Conférence",
      exposition: "Exposition",
      rencontre: "Rencontre",
    };

    const className = typeMap[type] || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {typeText[type] || type || "N/A"}
      </span>
    );
  };

  // Filter events based on search term and type
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      (event.titre &&
        event.titre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === "" || event.type === typeFilter;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Aucun événement trouvé</p>
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
        >
          Ajouter un événement
        </button>
      </div>
    );
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="spectacle">Spectacle</option>
            <option value="atelier">Atelier</option>
            <option value="conference">Conférence</option>
            <option value="exposition">Exposition</option>
            <option value="rencontre">Rencontre</option>
          </select>
        </div>
        {!limit && (
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Nouvel événement
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {event.titre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTypeBadge(event.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(event.date_debut)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewEvent(event)}
                    className="text-[oklch(47.3%_0.137_46.201)] hover:text-[oklch(50%_0.137_46.201)] mr-3"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="text-amber-600 hover:text-amber-900 mr-3"
                  >
                    Modifier
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteClick(event.id)}
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
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Supprimer
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est
          irréversible.
        </p>
      </Modal>

      <EventForm
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        event={editingEvent}
        onSuccess={handleEventFormSuccess}
        spaces={spaces}
      />

      <EventDetails
        isOpen={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        event={viewingEvent}
        onEdit={() => {
          setShowEventDetails(false);
          setEditingEvent(viewingEvent);
          setShowEventForm(true);
        }}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}