import { Link, useLocation } from "react-router-dom";
import { useAuth, useIsAdmin } from "../../auth/AuthContext";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/leagues", label: "Leagues" },
];

export function PublicNavbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();

  const renderAuthButton = () => {
    if (isAdmin) {
      return (
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 rounded-md">
            Admin Dashboard
          </Link>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 rounded-md"
          >
            Sign Out
          </button>
        </div>
      );
    }

    if (user) {
      return (
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 rounded-md"
        >
          Sign Out
        </button>
      );
    }

    return (
      <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 rounded-md">
        Sign In
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-900 font-bold">
              Liga Castrol
            </Link>
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path ? "bg-gray-900 text-white" : "text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {renderAuthButton()}
        </div>
      </div>
    </nav>
  );
}
