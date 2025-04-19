import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AuthForms from "./pages/AuthForms"
import DashboardAdmin from "./pages/DashboardAdmin"
import DashboardSuperAdmin from "./pages/DashboardSuperAdmin"
import ReservationsPage from "./pages/ReservationsPage"
import EventsPage from "./pages/EventsPage"
import TalentsPage from "./pages/TalentsPage"
import ReportsPage from "./pages/ReportsPage"
import SocialPage from "./pages/SocialPage"
import ConfigPage from "./pages/ConfigPage"
import Cookies from "js-cookie"

// Protected route component
const ProtectedRoute = ({ element, requiredRole }) => {
  const token = Cookies.get("jwt")
  const userRole = Cookies.get("userRole")

  // Always allow access during development if there's any token
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Skip role checking during development
  return element
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AuthForms />} />
        <Route path="/" element={<Navigate to="/dashboard/admin" replace />} />

        {/* Admin routes */}
        <Route path="/dashboard/admin" element={<ProtectedRoute element={<DashboardAdmin />} requiredRole="admin" />} />
        <Route
          path="/dashboard/reservations"
          element={<ProtectedRoute element={<ReservationsPage />} requiredRole="admin" />}
        />
        <Route path="/dashboard/events" element={<ProtectedRoute element={<EventsPage />} requiredRole="admin" />} />
        <Route path="/dashboard/talents" element={<ProtectedRoute element={<TalentsPage />} requiredRole="admin" />} />
        <Route path="/dashboard/reports" element={<ProtectedRoute element={<ReportsPage />} requiredRole="admin" />} />
        <Route path="/dashboard/social" element={<ProtectedRoute element={<SocialPage />} requiredRole="admin" />} />

        {/* SuperAdmin routes */}
        <Route
          path="/dashboard/superadmin"
          element={<ProtectedRoute element={<DashboardSuperAdmin />} requiredRole="superadmin" />}
        />
        <Route
          path="/dashboard/config"
          element={<ProtectedRoute element={<ConfigPage />} requiredRole="superadmin" />}
        />

        {/* Event and talent detail routes */}
        <Route path="/events/:id" element={<ProtectedRoute element={<EventsPage />} requiredRole="admin" />} />
        <Route path="/events/:id/edit" element={<ProtectedRoute element={<EventsPage />} requiredRole="admin" />} />
        <Route path="/events/new" element={<ProtectedRoute element={<EventsPage />} requiredRole="admin" />} />
        <Route path="/talents/:id" element={<ProtectedRoute element={<TalentsPage />} requiredRole="admin" />} />
        <Route path="/talents/:id/edit" element={<ProtectedRoute element={<TalentsPage />} requiredRole="admin" />} />
        <Route path="/talents/new" element={<ProtectedRoute element={<TalentsPage />} requiredRole="admin" />} />
        <Route
          path="/reservations/:id"
          element={<ProtectedRoute element={<ReservationsPage />} requiredRole="admin" />}
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
      </Routes>
    </Router>
  )
}

export default App
