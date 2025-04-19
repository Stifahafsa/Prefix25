import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginForm from './pages/AuthForms';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardSuperAdmin from './pages/DashboardSuperAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import ReservationsTable from './components/ReservationsTable'; // <-- Import the component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        {/* Route for /dashboard/reservations to show ReservationsTable */}
        <Route
          path="/dashboard/reservations"
          element={
            <ProtectedRoute>
              <ReservationsTable />
            </ProtectedRoute>
          }
        />
        {/* Nested routes for DashboardAdmin */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        >
          <Route index element={null} />
          <Route path="reservations" element={null} />
          <Route path="events" element={null} />
          <Route path="talents" element={null} />
          <Route path="reports" element={null} />
        </Route>
        <Route path="/dashboard/superadmin" element={<ProtectedRoute><DashboardSuperAdmin /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
