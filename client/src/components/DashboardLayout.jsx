import Sidebar from "./Sidebar";
import Cookies from "js-cookie"; // Import js-cookie

export default function DashboardLayout({ children, extraSidebarItems }) {
  // Retrieve email from cookies
  const userEmail = Cookies.get("userEmail");
  const role = Cookies.get("userRole");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar extraItems={extraSidebarItems} userEmail={userEmail} role={role} /> {/* Pass email as prop */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}