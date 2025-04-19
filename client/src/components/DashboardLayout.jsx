"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Toast from "./Toast"
import Cookies from "js-cookie"

export default function DashboardLayout({ children }) {
  const [userEmail, setUserEmail] = useState("")
  const [userRole, setUserRole] = useState("")
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [navigate] = useState(useNavigate())

  useEffect(() => {
    const email = Cookies.get("userEmail")
    const role = Cookies.get("userRole")
    const token = Cookies.get("jwt")

    if (!token) {
      navigate("/login")
      return
    }

    setUserEmail(email || "")
    setUserRole(role || "")

    // Skip token verification for now and just set loading to false
    // This allows us to use the dashboard with mock data
    setLoading(false)
  }, [navigate])

  const showToast = (message, type = "success") => {
    setToast({ message, type })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userEmail={userEmail} role={userRole} />
      <main className="flex-1 p-8 ml-20 md:ml-64 transition-all duration-300 ease-in-out">
        {children}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </main>
    </div>
  )
}
