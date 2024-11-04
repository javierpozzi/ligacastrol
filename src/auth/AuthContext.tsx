import { Session, User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase";

interface AuthState {
  session: Session | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState({ session });
        // fetchAdminStatus();
      } else {
        setAuthState({ session: null });
        setIsLoading(false);
      }
    });

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setAuthState({ session });
        // await fetchAdminStatus();
      } else {
        setAuthState({ session: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthState({ session: null });
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{
        session: authState.session,
        user: authState.session?.user ?? null,
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// create hook to check if user is admin using supabase query to users table using a useEffect and expose a boolean and a refresh function
export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Fetch admin status
  const fetchAdminStatus = useCallback(async () => {
    if (user && localStorage.getItem("isAdmin") === null) {
      setIsLoading(true);
      console.log("fetching admin status");
      const { data } = await supabase.from("users").select("is_admin").eq("id", user.id).single();
      console.log("admin status fetched", data);
      setIsAdmin(!!data?.is_admin);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin !== null) {
      localStorage.setItem("isAdmin", isAdmin.toString());
    }
  }, [isAdmin]);

  useEffect(() => {
    setIsLoading(true);
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== null) {
      console.log("isAdmin from local storage", isAdmin);
      setIsAdmin(isAdmin === "true");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAdminStatus();
  }, [fetchAdminStatus, user]);

  return { isAdmin, refresh: fetchAdminStatus, isLoading };
}
