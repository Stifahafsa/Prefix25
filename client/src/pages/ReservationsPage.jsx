"use client"

import { useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import ReservationsTable from "../components/ReservationsTable"

export default function ReservationsPage() {
  const [loading, setLoading] = useState(false)

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">Gestion des réservations</h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">Consultez et gérez toutes les réservations</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 p-6">
          <ReservationsTable />
        </div>
      </div>
    </DashboardLayout>
  )
}
