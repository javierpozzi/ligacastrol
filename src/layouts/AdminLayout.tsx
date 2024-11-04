import { Outlet } from "react-router-dom";
import { AdminGuard } from "../auth/AdminGuard";
import { AdminNavbar } from "../components/admin/AdminNavbar";

export function AdminLayout() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </AdminGuard>
  );
}
