import type { UserRole } from "@/types/roles";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Exclude<UserRole, "guest">;
};

export type AuthSession = {
  user: UserProfile;
};

export type AuthResult = {
  session?: AuthSession;
  error?: string;
  paymentRequired?: boolean;
};
