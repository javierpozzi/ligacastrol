import { Outlet } from "react-router-dom";
import { PublicNavbar } from "../components/public/PublicNavbar";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <PublicNavbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
