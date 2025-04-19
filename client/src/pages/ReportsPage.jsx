"use client"

import { useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import ReportsChart from "../components/ReportsChart"

export default function ReportsPage() {
  const [loading, setLoading] = useState(false)

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">Rapports et statistiques</h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">Consultez les statistiques et rapports d'activité</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-gray-200 text-[oklch(0.145_0_0)] rounded-lg shadow hover:bg-gray-300 transition-colors flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Exporter
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 p-6">
          <ReportsChart />
        </div>
      </div>
    </DashboardLayout>
  )
}
