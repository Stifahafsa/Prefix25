import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  ClipboardIcon,
  ShareIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  {
    label: "Tableau de bord",
    path: "/dashboard/admin",
    icon: HomeIcon,
  },
  {
    label: "Réservations",
    path: "/dashboard/reservations",
    icon: ClipboardIcon,
  },
  { 
    label: "Événements", 
    path: "/dashboard/events", 
    icon: CalendarIcon 
  },
  { 
    label: "Rapports", 
    path: "/dashboard/reports", 
    icon: ChartBarIcon 
  },
  { 
    label: "Talents", 
    path: "/dashboard/talents", 
    icon: UsersIcon 
  },
  { 
    label: "Réseaux Sociaux", 
    path: "/dashboard/social", 
    icon: ShareIcon 
  },
];

export default function Sidebar({ extraItems = [] , role , userEmail }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove all cookies and localStorage
    Cookies.remove("jwt");
    Cookies.remove("userEmail");
    Cookies.remove("userRole");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="bg-gradient-to-b from-[oklch(53%_0.137_46.201)] to-[oklch(27%_0.137_46.201)] text-gray-100 w-64 min-h-screen flex flex-col shadow-lg">
      {/* Logo area */}
      <div className="p-6 border-b border-[oklch(37%_0.137_46.201)/40] shadow-xl">
        <h2 className="text-xl font-bold text-white">Centre Culturel</h2>
        <p className="text-xs text-gray-200">Ouarzazate</p>
      </div>

      {/* User Profile Section - Styled to match screenshot */}
      <div className="flex items-center gap-3 p-4 from-[oklch(53%_0.137_46.201)] ">
        <div className="relative">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
        </div>
        <div className="flex-1">
          <div className="font-medium text-white">{userEmail}</div>
          <div className="text-xs text-gray-200">{role}</div>
        </div>
        <button
          onClick={handleLogout}
          className="p-1.5 rounded-full bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.3)] transition-colors"
          title="Déconnexion"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-4 mb-2">
          <p className="text-xs uppercase font-medium text-gray-200 tracking-wider pl-2">Menu</p>
        </div>
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-white text-[oklch(47.3%_0.137_46.201)] font-medium"
                      : "hover:bg-[oklch(37%_0.137_46.201)] text-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {extraItems.length > 0 && (
          <>
            <div className="px-4 mt-6 mb-2">
              <p className="text-xs uppercase font-medium text-gray-200 tracking-wider pl-2">Configuration</p>
            </div>
            <ul className="space-y-1 px-2">
              {extraItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? "bg-white text-[oklch(47.3%_0.137_46.201)] font-medium"
                          : "hover:bg-[oklch(37%_0.137_46.201)] text-gray-100"
                      }`}
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[oklch(37%_0.137_46.201)/40] text-center">
        <p className="text-xs text-gray-200">© 2025 Centre Culturel</p>
      </div>
    </aside>
  );
}