import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

export default function TalentsTable({ talents = [], canDelete, onDelete }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (onDelete && selectedId) {
      onDelete(selectedId);
    }
    setShowConfirmModal(false);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'actif': 'bg-green-100 text-green-800',
      'inactif': 'bg-red-100 text-red-800',
      'en_validation': 'bg-yellow-100 text-yellow-800'
    };
    
    const className = statusMap[status] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {status || 'N/A'}
      </span>
    );
  };

  if (!talents.length) {
    return <div className="text-center py-4 text-gray-500">Aucun talent trouvé</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {talents.map(talent => (
              <tr key={talent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{talent.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {talent.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {talent.domaine_artiste || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(talent.statut_talent)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => navigate(`/talents/${talent.id}`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Détails
                  </button>
                  <button 
                    onClick={() => navigate(`/talents/${talent.id}/edit`)}
                    className="text-amber-600 hover:text-amber-900 mr-3"
                  >
                    Modifier
                  </button>
                  {canDelete && (
                    <button 
                      onClick={() => handleDeleteClick(talent.id)}
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

      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
          <p className="text-sm text-gray-500 mb-4">
            Êtes-vous sûr de vouloir supprimer ce talent ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3">
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
          </div>
        </div>
      </Modal>
    </>
  );
}