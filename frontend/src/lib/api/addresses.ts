import { apiClient } from "@/lib/api/client";
import { unwrapApiArray, type ApiEnvelope } from "@/lib/api/response";
import type { Address } from "@/types/purchase";

type BackendUserAddress = {
  id: string;
  label?: string | null;
  type?: string | null;
  phone?: string | null;
  isDefault?: boolean;
  data?: unknown;
};

const asRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
};

const mapAddress = (address: BackendUserAddress): Address => {
  const data = asRecord(address.data);
  return {
    id: address.id,
    fullName: String(data.fullName ?? ""),
    phone: String(address.phone ?? data.phone ?? ""),
    line1: String(data.line1 ?? ""),
    line2:
      data.line2 === undefined || data.line2 === null ? "" : String(data.line2),
    city: String(data.city ?? ""),
    state: String(data.state ?? ""),
    zipCode: String(data.zipCode ?? ""),
    country: String(data.country ?? ""),
  };
};

const toAddressPayload = (address: Address) => ({
  label: "Home",
  type: "shipping",
  phone: address.phone,
  fullName: address.fullName,
  line1: address.line1,
  line2: address.line2 || null,
  city: address.city,
  state: address.state,
  zipCode: address.zipCode,
  country: address.country,
});

export const listAddresses = async (): Promise<Address[]> => {
  try {
    const response = await apiClient<ApiEnvelope<BackendUserAddress[]>>(
      "/users/addresses"
    );
    return unwrapApiArray(response).map(mapAddress);
  } catch {
    return [];
  }
};

export const saveAddress = async (address: Address): Promise<Address> => {
  const existingAddresses = await listAddresses();
  const exists = existingAddresses.some((item) => item.id === address.id);
  const path = exists ? `/users/addresses/${address.id}` : "/users/addresses";
  const method = exists ? "PUT" : "POST";

  const response = await apiClient<ApiEnvelope<BackendUserAddress[]>>(path, {
    method,
    body: JSON.stringify(toAddressPayload(address)),
  });

  const latest = unwrapApiArray(response).map(mapAddress);
  return latest.find((item) => item.id === address.id) ?? latest[0] ?? address;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await apiClient<ApiEnvelope<BackendUserAddress[]>>(`/users/addresses/${id}`, {
    method: "DELETE",
  });
};
