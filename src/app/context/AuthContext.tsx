import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

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

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d03e957c`;
const ADMIN_EMAILS = ['aryanjain281005@gmail.com', 'vyanasoul369@vyanasoul.com', 'vyanasoul369@gmail.com'];

// ── Types ──────────────────────────────────────────────────
export interface VyanaUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: VyanaUser | null;
  session: Session | null;
  accessToken: string | null;
  loading: boolean;
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
}

const AuthContext = createContext<AuthContextType | null>(null);

// ── AuthProvider ───────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabase();
  const [user, setUser] = useState<VyanaUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const mapUser = useCallback((u: User): VyanaUser => ({
    id: u.id,
    name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? u.email?.split('@')[0] ?? 'User',
    email: u.email ?? '',
    avatar: u.user_metadata?.avatar_url,
    role: (u.email && ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 'admin' : (u.user_metadata?.role as string ?? 'student')),
  }), []);

  // Restore session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? mapUser(session.user) : null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ? mapUser(nextSession.user) : null);
    });

    return () => subscription.unsubscribe();
  }, [supabase, mapUser]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Use the server route so we can auto-confirm the email
    const res = await fetch(`${SERVER_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Signup failed.');

    // Sign in right after
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const loginWithGoogle = async () => {
    // Do not forget to complete setup at https://supabase.com/docs/guides/auth/social-login/auth-google
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const accessToken = session?.access_token ?? null;

  return (
    <AuthContext.Provider value={{
      user, session, accessToken, loading,
      login, signup, loginWithGoogle, logout,
      loginModalOpen,
      openLoginModal: () => setLoginModalOpen(true),
      closeLoginModal: () => setLoginModalOpen(false),
      dashboardOpen,
      openDashboard: () => setDashboardOpen(true),
      closeDashboard: () => setDashboardOpen(false),
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

// ── API helper ─────────────────────────────────────────────
export async function apiFetch(path: string, accessToken: string, options: RequestInit = {}) {
  const url = `${SERVER_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request failed: ${res.status}`);
  return data;
}
