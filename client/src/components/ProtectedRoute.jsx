import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = Cookies.get('jwt');
  const userRole = Cookies.get('userRole');

  if (!token) {
    // Rediriger vers la page de connexion si le token est manquant
    return <Navigate to="/login" />;
  }

  // Si aucun rôle n'est spécifié, autoriser l'accès à tous les utilisateurs connectés
  if (allowedRoles.length === 0) {
    return children;
  }

  // Vérifier si le rôle de l'utilisateur est autorisé
  if (!allowedRoles.includes(userRole)) {
    // Rediriger vers une page appropriée en fonction du rôle
    if (userRole === 'utilisateur') {
      return <Navigate to="/UserProfil" />;
    } else if (userRole === 'talent') {
      return <Navigate to="/TalentProfil" />;
    } else if (userRole === 'admin') {
      return <Navigate to="/dashboard/admin" />;
    } else if (userRole === 'superadmin') {
      return <Navigate to="/dashboard/superadmin" />;
    } else {
      // Redirection par défaut
      return <Navigate to="/login" />;
    }
  }

  return children;
}

export default ProtectedRoute;