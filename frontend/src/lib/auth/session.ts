import type { UserRole } from "@/types/roles";

export type Session = {
  userId?: string;
  role: UserRole;
  token?: string;
};

export const getSession = async (): Promise<Session> => {
  if (typeof window === "undefined") return { role: "guest" };
  const raw = window.localStorage.getItem("zoe_market_session");
  if (!raw) return { role: "guest" };

  try {
    const parsed = JSON.parse(raw) as { token: string; user: { id: string; role: Exclude<UserRole, "guest"> } };
    return { userId: parsed.user.id, role: parsed.user.role, token: parsed.token };
  } catch {
    return { role: "guest" };
  }
};

export const canAccessRoleArea = (sessionRole: UserRole, requiredRole: UserRole) => {
  if (requiredRole === "customer") return sessionRole !== "guest";
  return sessionRole === requiredRole;
};
