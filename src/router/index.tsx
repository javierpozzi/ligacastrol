import { createBrowserRouter, Navigate } from "react-router-dom";
import LeagueList from "../components/leagues/LeagueList";
import { LocationList } from "../components/locations/LocationList";
import { TeamList } from "../components/teams/TeamList";
import { AdminLayout } from "../layouts/AdminLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminDashboard } from "../pages/admin/Dashboard";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { PublicHome } from "../pages/public/Home";
import { PublicLeagueDetails } from "../pages/public/LeagueDetails";
import { PublicLeagues } from "../pages/public/Leagues";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <PublicHome /> },
      { path: "leagues", element: <PublicLeagues /> },
      { path: "leagues/:id", element: <PublicLeagueDetails /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "teams", element: <TeamList /> },
      { path: "leagues", element: <LeagueList /> },
      { path: "locations", element: <LocationList /> },
    ],
  },
  //   {
  //     path: "/admin",
  //     element: <AdminLayout />,
  //     children: [
  //       { index: true, element: <AdminDashboard /> },
  //       { path: "teams", element: <AdminTeams /> },
  //       { path: "leagues", element: <AdminLeagues /> },
  //       { path: "locations", element: <AdminLocations /> },
  //     ],
  //   },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);
