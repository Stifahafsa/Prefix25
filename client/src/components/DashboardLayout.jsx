"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = Cookies.get("jwt");
    if (!token) {
      navigate("/login");
    } else {
      // Récupérer le nom d'utilisateur
      const name = Cookies.get("userEmail");
      setUserName(name || "Utilisateur");
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("jwt");
    Cookies.remove("userRole");
    Cookies.remove("userName");
    Cookies.remove("userId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[oklch(0.97_0_0)]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="bg-white border-b border-[oklch(0.922_0_0)] h-16 flex items-center px-2 sticky top-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden text-[oklch(0.3_0_0)] hover:text-[oklch(0.145_0_0)] mr-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          
        </header>

        {/* Main content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
