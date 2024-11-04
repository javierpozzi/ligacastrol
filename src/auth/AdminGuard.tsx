import { Navigate, useLocation } from "react-router-dom";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { useAuth, useIsAdmin } from "./AuthContext";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const location = useLocation();


  console.log(isLoading, isAdminLoading, isAdmin, user);
  if (isLoading || isAdminLoading || isAdmin === null || user === null) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
