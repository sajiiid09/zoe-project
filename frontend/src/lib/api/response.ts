export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    currentPage?: number;
    totalPages?: number;
    totalProducts?: number;
    totalOrders?: number;
    totalUsers?: number;
    total?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
};

export const unwrapApiData = <T>(payload: ApiEnvelope<T>, fallback: T): T => {
  if (payload && payload.success && payload.data !== undefined) {
    return payload.data;
  }

  return fallback;
};

export const unwrapApiArray = <T>(payload: ApiEnvelope<T[]>): T[] => {
  return unwrapApiData(payload, []);
};
