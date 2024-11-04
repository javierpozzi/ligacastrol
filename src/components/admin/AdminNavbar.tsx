import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const navItems = [
  { path: "/admin/teams", label: "Teams" },
  { path: "/admin/leagues", label: "Leagues" },
  { path: "/admin/locations", label: "Locations" },
  { path: "/admin/players", label: "Players" },
];

export function AdminNavbar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/admin" className="text-gray-900 font-bold">
              Admin Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname.startsWith(item.path)
                      ? "bg-gray-900 text-white"
                      : "text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
} 