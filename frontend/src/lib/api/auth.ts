import { ApiError, apiClient } from "@/lib/api/client";
import type { AuthResult, AuthSession, UserProfile } from "@/types/auth";

type BackendUserRole = "ADMIN" | "CUSTOMER" | "VENDOR" | "AFFILIATE";

type BackendUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: BackendUserRole;
  vendorFeePaid?: boolean;
  affiliateFeePaid?: boolean;
};

type BackendAuthPayload = {
  success: boolean;
  message?: string;
  requiresPayment?: boolean;
  user?: BackendUser;
  data?: BackendUser;
};

let sessionCache: AuthSession | null = null;

const roleMap: Record<BackendUserRole, UserProfile["role"]> = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  VENDOR: "vendor",
  AFFILIATE: "affiliate",
};

const splitFullName = (fullName: string) => {
  const normalized = fullName.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return {
      firstName: "",
      lastName: "",
    };
  }

  const [firstName, ...lastNameParts] = normalized.split(" ");
  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
};

const formatFullName = (user: BackendUser) => {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (fullName) {
    return fullName;
  }

  return user.email;
};

const mapUser = (user: BackendUser): UserProfile => ({
  id: user.id,
  email: user.email,
  fullName: formatFullName(user),
  phone: user.phone ?? undefined,
  role: roleMap[user.role],
});

const extractUser = (payload: BackendAuthPayload): BackendUser | null => {
  if (payload.user) {
    return payload.user;
  }

  if (payload.data) {
    return payload.data;
  }

  return null;
};

const toSession = (user: BackendUser): AuthSession => ({
  user: mapUser(user),
});

const setSessionCache = (session: AuthSession | null) => {
  sessionCache = session;
};

const readApiErrorDetails = (
  error: unknown
): { message?: string; requiresPayment?: boolean; user?: BackendUser } | null => {
  if (!(error instanceof ApiError)) {
    return null;
  }

  const details = error.details;
  if (!details || typeof details !== "object") {
    return null;
  }
  const detailsRecord = details as Record<string, unknown>;

  const result: { message?: string; requiresPayment?: boolean; user?: BackendUser } = {};

  if (typeof detailsRecord.message === "string") {
    result.message = detailsRecord.message;
  }

  if (typeof detailsRecord.requiresPayment === "boolean") {
    result.requiresPayment = detailsRecord.requiresPayment;
  }

  if (detailsRecord.user && typeof detailsRecord.user === "object") {
    result.user = detailsRecord.user as BackendUser;
  }

  return result;
};

const readApiErrorMessage = (error: unknown, fallback: string) => {
  const details = readApiErrorDetails(error);
  if (details?.message) {
    return details.message;
  }

  return fallback;
};

export const readStoredSession = (): AuthSession | null => {
  return sessionCache;
};

export const bootstrapSession = async (): Promise<AuthSession | null> => {
  try {
    const response = await apiClient<BackendAuthPayload>("/users/profile");
    const backendUser = extractUser(response);

    if (!backendUser) {
      setSessionCache(null);
      return null;
    }

    const session = toSession(backendUser);
    setSessionCache(session);
    return session;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      setSessionCache(null);
      return null;
    }

    setSessionCache(null);
    return null;
  }
};

export const login = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const response = await apiClient<BackendAuthPayload>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const backendUser = extractUser(response);
    if (!backendUser) {
      return { error: "Could not sign in." };
    }

    const session = toSession(backendUser);
    setSessionCache(session);
    return { session, role: session.user.role };
  } catch (error) {
    const details = readApiErrorDetails(error);
    if (error instanceof ApiError && error.status === 402 && details?.requiresPayment) {
      const backendUser = details.user;
      const session = backendUser ? toSession(backendUser) : undefined;
      if (session) {
        setSessionCache(session);
      }

      return {
        session,
        error: readApiErrorMessage(
          error,
          "Your account requires payment activation before login."
        ),
        paymentRequired: true,
        role: session?.user.role,
      };
    }

    return { error: readApiErrorMessage(error, "Could not sign in.") };
  }
};

export const register = async (payload: {
  fullName: string;
  email: string;
  password: string;
  role?: Extract<UserProfile["role"], "customer" | "vendor" | "affiliate">;
}): Promise<AuthResult> => {
  const { firstName, lastName } = splitFullName(payload.fullName);
  const backendRole = payload.role ? payload.role.toUpperCase() : undefined;

  try {
    const response = await apiClient<BackendAuthPayload>("/users/register", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        role: backendRole,
      }),
    });

    const backendUser = extractUser(response);
    if (!backendUser) {
      return { error: "Could not create account." };
    }

    const session = toSession(backendUser);
    setSessionCache(session);
    return { session, role: session.user.role };
  } catch (error) {
    return { error: readApiErrorMessage(error, "Could not create account.") };
  }
};

export const logout = async () => {
  try {
    await apiClient<{ success: boolean; message: string }>("/users/logout", {
      method: "POST",
    });
  } catch {
    // Ignore logout transport errors and always clear local session cache.
  }

  setSessionCache(null);
};

export const updateProfile = async (
  input: Partial<UserProfile>
): Promise<UserProfile | null> => {
  const body: {
    name?: { firstName?: string; lastName?: string };
    phone?: string;
  } = {};

  if (input.fullName !== undefined) {
    const { firstName, lastName } = splitFullName(input.fullName);
    body.name = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    };
  }

  if (input.phone !== undefined) {
    body.phone = input.phone;
  }

  try {
    const response = await apiClient<BackendAuthPayload>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    });
    const backendUser = extractUser(response);
    if (!backendUser) {
      return null;
    }

    const updatedUser = mapUser(backendUser);
    setSessionCache({ user: updatedUser });
    return updatedUser;
  } catch {
    return null;
  }
};
