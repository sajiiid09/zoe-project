import type { UserRole } from "@/types/roles";

export type Session = {
  userId?: string;
  role: UserRole;
  token?: string;
};

export const getSession = async (): Promise<Session> => {
  return { role: "guest" };
};

export const canAccessRoleArea = (sessionRole: UserRole, requiredRole: UserRole) => {
  if (requiredRole === "customer") return sessionRole !== "guest";
  return sessionRole === requiredRole;
};
