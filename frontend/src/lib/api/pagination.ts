export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export const emptyPage = <T>(page = 1, pageSize = 20): PaginatedResponse<T> => ({
  items: [],
  page,
  pageSize,
  total: 0,
});
