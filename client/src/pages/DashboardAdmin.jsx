import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import SummaryCards from "../components/SummaryCards";
import ReservationsTable from "../components/ReservationsTable";
import EventsTable from "../components/EventsTable";
import TalentsTable from "../components/TalentsTable";
import ReportsChart from "../components/ReportsChart";
import api from "../api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, UsersIcon, ChartBarIcon, ClipboardIcon, ShareIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function DashboardAdmin() {
  const [stats, setStats] = useState([
    { label: "Réservations", value: 0 },
    { label: "Événements", value: 0 },
    { label: "Talents", value: 0 },
    { label: "Rapports", value: 0 },
  ]);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    Cookies.remove("jwt");
    Cookies.remove("userEmail");
    Cookies.remove("userRole");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch stats
        const statsResponse = await api.get('/dashboard/stats');
        if (statsResponse.data) {
          setStats([
            { label: "Réservations", value: statsResponse.data.reservations || 0 },
            { label: "Événements", value: statsResponse.data.events || 0 },
            { label: "Talents", value: statsResponse.data.talents || 0 },
            { label: "Rapports", value: statsResponse.data.reports || 0 },
          ]);
        }

        // Fetch initial data for overview
        const [reservationsRes, eventsRes, talentsRes] = await Promise.all([
          api.get('/reservations?limit=5'),
          api.get('/evenements?limit=5'),
          api.get('/utilisateurs?is_talent=true&limit=5')
        ]);

        setReservations(reservationsRes.data || []);
        setEvents(eventsRes.data || []);
        setTalents(talentsRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Closing profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Function to handle tab change with data fetching
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setLoading(true);
    
    try {
      if (tab === "reservations") {
        const res = await api.get('/reservations');
        setReservations(res.data || []);
      } else if (tab === "events") {
        const res = await api.get('/evenements');
        setEvents(res.data || []);
      } else if (tab === "talents") {
        const res = await api.get('/utilisateurs?is_talent=true');
        setTalents(res.data || []);
      }
    } catch (error) {
      console.error(`Error loading ${tab} data:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">
              Tableau de bord
            </h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">
              Bienvenue dans votre espace administrateur
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2 items-center">
            <button 
              onClick={() => navigate("/events/new")}
              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
            >
              Nouvel événement
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards stats={stats} />

        {/* Main Content Area */}
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
              
              {/* Other tab buttons */}
              {/* ... */}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* Overview content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold text-gray-900">Dernières réservations</h2>
                          <button
                            onClick={() => handleTabChange("reservations")}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            Voir tout
                          </button>
                        </div>
                        <ReservationsTable
                          reservations={reservations.slice(0, 5)}
                          canDelete={false}
                        />
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold text-gray-900">Prochains événements</h2>
                          <button
                            onClick={() => handleTabChange("events")}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            Voir tout
                          </button>
                        </div>
                        <EventsTable
                          events={events.slice(0, 5)}
                          canDelete={false}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reservations" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">Gestion des réservations</h2>
                    <ReservationsTable
                      reservations={reservations}
                      canDelete={false}
                    />
                  </div>
                )}

                {activeTab === "events" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900">Gestion des événements</h2>
                      <button
                        onClick={() => navigate("/events/new")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Nouvel événement
                      </button>
                    </div>
                    <EventsTable
                      events={events}
                      canDelete={false}
                    />
                  </div>
                )}

                {activeTab === "talents" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">Gestion des talents</h2>
                    <TalentsTable
                      talents={talents}
                      canDelete={false}
                    />
                  </div>
                )}

                {activeTab === "reports" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">Rapports</h2>
                    <ReportsChart />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}