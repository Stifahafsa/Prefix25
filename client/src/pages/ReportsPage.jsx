"use client";

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Charts from "../components/Charts";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">
              Rapports et statistiques
            </h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">
              Consultez les statistiques et rapports d'activité
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
            >
              Imprimer la page
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 p-6">
          <Charts />
        </div>
        
        {/* Statistiques supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] p-6">
            <h2 className="text-lg font-semibold mb-4 text-[oklch(0.145_0_0)]">
              Statistiques des événements
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Événements planifiés</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Événements confirmés</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Événements annulés</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux d'occupation moyen</span>
                <span className="font-semibold">78%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] p-6">
            <h2 className="text-lg font-semibold mb-4 text-[oklch(0.145_0_0)]">
              Statistiques des utilisateurs
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Utilisateurs actifs</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nouveaux utilisateurs (ce mois)</span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Talents actifs</span>
                <span className="font-semibold">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Talents en validation</span>
                <span className="font-semibold">4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}