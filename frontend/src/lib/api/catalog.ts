import { mapBackendCatalogProductToView } from "@/lib/api/adapters";
import { apiClient } from "@/lib/api/client";
import { unwrapApiData, type ApiEnvelope } from "@/lib/api/response";
import type { ProductViewModel } from "@/types/catalog";

type BackendCatalogProduct = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  retailPrice: number | string;
  stock?: number | null;
  images?: unknown;
  status?: string;
};

export const getCatalogEntity = async (
  id: string
): Promise<ProductViewModel | null> => {
  try {
    const response = await apiClient<ApiEnvelope<BackendCatalogProduct>>(`/catalog/${id}`);
    const product = unwrapApiData<BackendCatalogProduct | null>(response, null);
    return product ? mapBackendCatalogProductToView(product) : null;
  } catch {
    return null;
  }
};
