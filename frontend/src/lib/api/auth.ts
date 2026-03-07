import { apiClient } from "@/lib/api/client";
import type { AuthResult, AuthSession, UserProfile } from "@/types/auth";

type StoredUser = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserProfile["role"];
  phone?: string;
  isPaid?: boolean;
};

const USERS_KEY = "zoe_market_users";
const SESSION_KEY = "zoe_market_session";

const readUsers = (): StoredUser[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) {
    const seeded: StoredUser[] = [
      { id: "u1", fullName: "Alex Customer", email: "customer@zoe.test", password: "Password123!", role: "customer", isPaid: true },
      { id: "u2", fullName: "Vendor Demo", email: "vendor@zoe.test", password: "Password123!", role: "vendor", isPaid: false },
      { id: "u3", fullName: "Admin Demo", email: "admin@zoe.test", password: "Password123!", role: "admin", isPaid: true },
    ];
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const storeSession = (session: AuthSession | null) => {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const readStoredSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

export const login = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const session = await apiClient<AuthSession>("/auth/login/", { method: "POST", body: JSON.stringify({ email, password }) });
    storeSession(session);
    return { session };
  } catch {
    const user = readUsers().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!user) return { error: "Invalid email or password." };
    if ((user.role === "vendor" || user.role === "affiliate") && !user.isPaid) {
      return { error: "Your account requires payment activation before login.", paymentRequired: true };
    }

    const session: AuthSession = {
      token: `local-${user.id}`,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, phone: user.phone },
    };
    storeSession(session);
    return { session };
  }
};

export const register = async (payload: { fullName: string; email: string; password: string; role?: UserProfile["role"] }): Promise<AuthResult> => {
  try {
    const session = await apiClient<AuthSession>("/auth/register/", { method: "POST", body: JSON.stringify(payload) });
    storeSession(session);
    return { session };
  } catch {
    const users = readUsers();
    if (users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase())) {
      return { error: "Email is already registered." };
    }
    const user: StoredUser = {
      id: `u${Date.now()}`,
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      role: payload.role ?? "customer",
      isPaid: true,
    };
    writeUsers([user, ...users]);
    const session: AuthSession = {
      token: `local-${user.id}`,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, phone: user.phone },
    };
    storeSession(session);
    return { session };
  }
};

export const logout = async () => {
  storeSession(null);
};

export const updateProfile = async (input: Partial<UserProfile>): Promise<UserProfile | null> => {
  const current = readStoredSession();
  if (!current) return null;

  try {
    return await apiClient<UserProfile>("/profile/", { method: "PATCH", body: JSON.stringify(input), token: current.token });
  } catch {
    const users = readUsers();
    const idx = users.findIndex((item) => item.id === current.user.id);
    if (idx < 0) return null;
    users[idx] = { ...users[idx], fullName: input.fullName ?? users[idx].fullName, phone: input.phone ?? users[idx].phone };
    writeUsers(users);

    const updated: AuthSession = {
      ...current,
      user: {
        ...current.user,
        fullName: input.fullName ?? current.user.fullName,
        phone: input.phone ?? current.user.phone,
      },
    };
    storeSession(updated);
    return updated.user;
  }
};
