import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import SummaryCards from "../components/SummaryCards";
import ReservationsTable from "../components/ReservationsTable";
import EventsTable from "../components/EventsTable";
import TalentsTable from "../components/TalentsTable";
import ReportsChart from "../components/ReportsChart";
import api from "../api";
import {
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  ClipboardIcon,
  ShareIcon,
  CogIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function DashboardSuperAdmin() {
  const [stats, setStats] = useState([
    { label: "Réservations", value: 42 },
    { label: "Événements", value: 8 },
    { label: "Talents", value: 15 },
    { label: "Rapports", value: 3 },
  ]);

  const [activeTab, setActiveTab] = useState("overview");

  // Extra sidebar items specific to SuperAdmin
  const extraSidebarItems = [
    { label: "Configuration", path: "/dashboard/config" },
    { label: "Utilisateurs", path: "/dashboard/users" },
  ];

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Simulating data fetching
  useEffect(() => {
    // Replace with actual API calls when ready
    const fetchDashboardData = async () => {
      try {
        // const response = await api.get('/dashboard/stats');
        // setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout extraSidebarItems={extraSidebarItems}>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">
              Administration Centrale
            </h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">
              Bienvenue dans votre espace super administrateur
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <button className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors">
              Nouvel événement
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] p-6 flex items-center space-x-4"
            >
              <div className="bg-[oklch(47.3%_0.137_46.201)]/10 p-3 rounded-lg">
                {index === 0 && (
                  <ClipboardIcon className="w-6 h-6 text-[oklch(47.3%_0.137_46.201)]" />
                )}
                {index === 1 && (
                  <CalendarIcon className="w-6 h-6 text-[oklch(47.3%_0.137_46.201)]" />
                )}
                {index === 2 && (
                  <UsersIcon className="w-6 h-6 text-[oklch(47.3%_0.137_46.201)]" />
                )}
                {index === 3 && (
                  <ChartBarIcon className="w-6 h-6 text-[oklch(47.3%_0.137_46.201)]" />
                )}
              </div>
              <div>
                <div className="text-3xl font-bold text-[oklch(0.145_0_0)]">
                  {stat.value}
                </div>
                <div className="text-sm mt-1 text-[oklch(0.556_0_0)]">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 overflow-hidden">
          {/* Tabs navigation */}
          <div className="px-6 pt-6 border-b border-[oklch(0.922_0_0)]">
            <div className="flex overflow-x-auto hide-scrollbar">
              <button
                onClick={() => handleTabChange("overview")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <ChartBarIcon className="w-5 h-5" />
                <span className="hidden md:inline">Vue d'ensemble</span>
              </button>

              <button
                onClick={() => handleTabChange("reservations")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "reservations"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <ClipboardIcon className="w-5 h-5" />
                <span className="hidden md:inline">Réservations</span>
              </button>

              <button
                onClick={() => handleTabChange("events")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "events"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <CalendarIcon className="w-5 h-5" />
                <span className="hidden md:inline">Événements</span>
              </button>

              <button
                onClick={() => handleTabChange("talents")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "talents"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <UsersIcon className="w-5 h-5" />
                <span className="hidden md:inline">Talents</span>
              </button>

              <button
                onClick={() => handleTabChange("reports")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "reports"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span className="hidden md:inline">Rapports</span>
              </button>

              <button
                onClick={() => handleTabChange("settings")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "settings"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <CogIcon className="w-5 h-5" />
                <span className="hidden md:inline">Paramètres</span>
              </button>
            </div>
          </div>

          {/* Tabs content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-[oklch(0.145_0_0)]">
                    Aperçu des activités
                  </h2>
                  <ReportsChart />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-[oklch(0.145_0_0)]">
                    Réservations récentes
                  </h2>
                  <ReservationsTable limit={5} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-[oklch(0.145_0_0)]">
                    Événements à venir
                  </h2>
                  <EventsTable limit={5} />
                </div>
              </div>
            )}

            {activeTab === "reservations" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                    Toutes les réservations
                  </h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Recherche..."
                      className="px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                    />
                    <select className="px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]">
                      <option value="">Tous les statuts</option>
                      <option value="confirmed">Confirmé</option>
                      <option value="pending">En attente</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                </div>
                <ReservationsTable />
              </div>
            )}

            {activeTab === "events" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                    Gestion des événements
                  </h2>
                  <button className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors">
                    Nouvel événement
                  </button>
                </div>
                <EventsTable />
              </div>
            )}

            {activeTab === "talents" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                    Gestion des talents
                  </h2>
                  <button className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors">
                    Ajouter un talent
                  </button>
                </div>
                <TalentsTable />
              </div>
            )}

            {activeTab === "reports" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                    Rapports et statistiques
                  </h2>
                  <div className="flex items-center gap-2">
                    <select className="px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]">
                      <option value="month">Ce mois</option>
                      <option value="quarter">Ce trimestre</option>
                      <option value="year">Cette année</option>
                    </select>
                    <button className="px-4 py-2 bg-gray-200 text-[oklch(0.145_0_0)] rounded-lg shadow hover:bg-gray-300 transition-colors flex items-center gap-1">
                      <ShareIcon className="w-5 h-5" />
                      Exporter
                    </button>
                  </div>
                </div>
                <div className="mb-8">
                  <ReportsChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-[oklch(0.922_0_0)]">
                    <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">
                      Performance des événements
                    </h3>
                    {/* Placeholder for event performance table/chart */}
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-[oklch(0.556_0_0)]">
                      Graphique de performance des événements
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-[oklch(0.922_0_0)]">
                    <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">
                      Revenus par catégorie
                    </h3>
                    {/* Placeholder for revenue by category chart */}
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-[oklch(0.556_0_0)]">
                      Graphique des revenus par catégorie
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="text-lg font-semibold mb-6 text-[oklch(0.145_0_0)]">
                  Paramètres du tableau de bord
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">
                      Informations générales
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">
                          Nom de la plateforme
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                          defaultValue="EventBridge"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">
                          Email de contact
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                          defaultValue="contact@eventbridge.com"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">
                          Fuseau horaire
                        </label>
                        <select className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]">
                          <option value="Europe/Paris">Europe/Paris</option>
                          <option value="America/New_York">
                            America/New_York
                          </option>
                          <option value="Asia/Tokyo">Asia/Tokyo</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">
                      Options de notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-[oklch(0.3_0_0)]">
                            Notifications par email
                          </h4>
                          <p className="text-sm text-[oklch(0.556_0_0)]">
                            Recevoir les notifications par email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-[oklch(0.3_0_0)]">
                            Notifications dans l'application
                          </h4>
                          <p className="text-sm text-[oklch(0.556_0_0)]">
                            Afficher les notifications dans l'interface
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-[oklch(0.3_0_0)]">
                            Rapports hebdomadaires
                          </h4>
                          <p className="text-sm text-[oklch(0.556_0_0)]">
                            Recevoir un rapport hebdomadaire
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[oklch(0.922_0_0)]">
                  <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">
                    Sécurité et accès
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">
                            Durée de session (minutes)
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                            defaultValue="60"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">
                            Nombre max de tentatives de connexion
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                            defaultValue="5"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-[oklch(0.3_0_0)]">
                            Authentification à deux facteurs
                          </h4>
                          <p className="text-sm text-[oklch(0.556_0_0)]">
                            Exiger pour tous les utilisateurs
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-[oklch(0.3_0_0)]">
                            Journalisation des activités
                          </h4>
                          <p className="text-sm text-[oklch(0.556_0_0)]">
                            Enregistrer toutes les activités admin
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="px-6 py-2 bg-gray-200 text-[oklch(0.145_0_0)] rounded-lg shadow hover:bg-gray-300 transition-colors mr-4">
                    Annuler
                  </button>
                  <button className="px-6 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors">
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
