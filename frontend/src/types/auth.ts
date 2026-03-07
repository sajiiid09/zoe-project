import type { UserRole } from "@/types/roles";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Exclude<UserRole, "guest">;
};

export type AuthSession = {
  token: string;
  user: UserProfile;
};

export type AuthResult = {
  session?: AuthSession;
  error?: string;
  paymentRequired?: boolean;
};
