import { readStoredSession } from "@/lib/api/auth";
import type { UserRole } from "@/types/roles";

export type Session = {
  userId?: string;
  role: UserRole;
};

export const getSession = async (): Promise<Session> => {
  const storedSession = readStoredSession();

  if (!storedSession) {
    return { role: "guest" };
  }

  return {
    userId: storedSession.user.id,
    role: storedSession.user.role,
  };
};

export const canAccessRoleArea = (
  sessionRole: UserRole,
  requiredRole: UserRole
) => {
  if (requiredRole === "customer") return sessionRole !== "guest";
  return sessionRole === requiredRole;
};
