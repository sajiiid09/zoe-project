"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import * as authApi from "@/lib/api/auth";
import type { AuthSession, UserProfile } from "@/types/auth";
import type { UserRole } from "@/types/roles";

type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; paymentRequired?: boolean; role?: Exclude<UserRole, "guest"> }>;
  register: (input: { fullName: string; email: string; password: string; role?: Exclude<UserRole, "guest"> }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (input: Partial<UserProfile>) => Promise<{ ok: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<AuthSession | null>(authApi.readStoredSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const hydrateSession = async () => {
      const currentSession = await authApi.bootstrapSession();
      if (!mounted) return;

      setSession(currentSession);
      setLoading(false);
    };

    hydrateSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login: AuthContextValue["login"] = async (email, password) => {
    setLoading(true);
    const result = await authApi.login(email, password);
    setLoading(false);
    if (result.session) {
      setSession(result.session);
      return { ok: true, role: result.session.user.role };
    }
    return { ok: false, error: result.error, paymentRequired: result.paymentRequired };
  };

  const register: AuthContextValue["register"] = async (input) => {
    setLoading(true);
    const result = await authApi.register(input);
    setLoading(false);
    if (result.session) {
      setSession(result.session);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  };

  const logout = async () => {
    setLoading(true);
    await authApi.logout();
    setSession(null);
    setLoading(false);
  };

  const updateProfile: AuthContextValue["updateProfile"] = async (input) => {
    setLoading(true);
    const updated = await authApi.updateProfile(input);
    setLoading(false);
    if (!updated) return { ok: false, error: "Could not update profile right now." };

    setSession((prev) => (prev ? { ...prev, user: updated } : prev));
    return { ok: true };
  };

  const value = useMemo(() => ({ session, loading, login, register, logout, updateProfile }), [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
