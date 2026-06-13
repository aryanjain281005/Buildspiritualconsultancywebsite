import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { projectId, publicAnonKey, ADMIN_EMAILS } from '../../../utils/supabase/info';

// ── Supabase singleton ─────────────────────────────────────
let _supabase: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
    );
  }
  return _supabase;
}

// ── Types ──────────────────────────────────────────────────
export interface VyanaUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  phone?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone: string;
  avatar_url: string;
  created_at: string;
}

interface AuthContextType {
  user: VyanaUser | null;
  session: Session | null;
  accessToken: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  // Dashboard redirect trigger
  dashboardOpen: boolean;
  openDashboard: () => void;
  closeDashboard: () => void;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ── Fetch profile from profiles table ─────────────────────
async function fetchProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
  return data;
}

// ── AuthProvider ───────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabase();
  const [user, setUser] = useState<VyanaUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const mapUserWithProfile = useCallback(async (authUser: User, profile?: Profile | null): Promise<VyanaUser> => {
    // If no profile passed, try to fetch it
    if (!profile) {
      const supabase = getSupabase();
      profile = await fetchProfile(supabase, authUser.id);
    }

    return {
      id: authUser.id,
      name: profile?.name ?? authUser.user_metadata?.name ?? authUser.user_metadata?.full_name ?? authUser.email?.split('@')[0] ?? 'User',
      email: authUser.email ?? '',
      avatar: profile?.avatar_url || authUser.user_metadata?.avatar_url,
      role: (profile?.role === 'admin' || isAdminEmail(authUser.email ?? '')) ? 'admin' : 'user',
      phone: profile?.phone,
    };
  }, []);

  // Restore session on mount
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const mappedUser = await mapUserWithProfile(session.user);
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const mappedUser = await mapUserWithProfile(session.user);
        setUser(mappedUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, mapUserWithProfile]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Check if this is an admin email — admins should NOT signup, only login
    if (ADMIN_EMAILS.some(e => e.toLowerCase() === email.toLowerCase())) {
      throw new Error('This email is reserved for admin. Please use the Login tab.');
    }

    // Check if account already exists by trying to sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
        throw new Error('An account with this email already exists. Please switch to the Login tab.');
      }
      throw new Error(error.message);
    }

    // If user was returned but identities is empty, the user already exists
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      throw new Error('An account with this email already exists. Please switch to the Login tab.');
    }

    // Auto sign-in after successful signup
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw new Error(signInError.message);
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    setUser(null);
    setSession(null);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const accessToken = session?.access_token ?? null;
  const isAdmin = user?.role === 'admin' || (user?.email ? isAdminEmail(user.email) : false);

  return (
    <AuthContext.Provider value={{
      user, session, accessToken, loading, isAdmin,
      login, signup, loginWithGoogle, logout,
      loginModalOpen,
      openLoginModal: () => setLoginModalOpen(true),
      closeLoginModal: () => setLoginModalOpen(false),
      dashboardOpen,
      openDashboard: () => setDashboardOpen(true),
      closeDashboard: () => setDashboardOpen(false),
      supabase,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ── Check if email is admin ──────────────────────────────
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.some(e => e.toLowerCase() === email.toLowerCase());
}
