import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../../config/supabase";
import { useEffect } from "react";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isLoading } = useAuth();
  const from = location.state?.from?.pathname || "/admin";

  useEffect(() => {
    supabase
      .from("users")
      .select("*")
      .then(({ data }) => {
        console.log("users", data);
      });
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    console.log("session", session);
    console.log("isLoading", isLoading);
    if (session && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [session, isLoading, navigate, from]);

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Don't render login form if already logged in
  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
}
