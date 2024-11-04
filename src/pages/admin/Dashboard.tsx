import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome, Admin
        </h1>
        <p className="text-gray-600">
          You are logged in as {user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Teams"
          description="Manage teams and their preferences"
          link="/admin/teams"
        />
        <DashboardCard
          title="Leagues"
          description="Manage leagues and fixtures"
          link="/admin/leagues"
        />
        <DashboardCard
          title="Locations"
          description="Manage match locations"
          link="/admin/locations"
        />
        <DashboardCard
          title="Players"
          description="Manage team players"
          link="/admin/players"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link }: { 
  title: string; 
  description: string; 
  link: string; 
}) {
  return (
    <Link
      to={link}
      className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
} 