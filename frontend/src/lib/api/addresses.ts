import { apiClient } from "@/lib/api/client";
import type { Address } from "@/types/purchase";

const ADDRESS_KEY = "zoe_market_addresses";

const readLocal = (): Address[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ADDRESS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Address[];
  } catch {
    return [];
  }
};

const writeLocal = (addresses: Address[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
};

export const listAddresses = async (): Promise<Address[]> => {
  try {
    return await apiClient<Address[]>("/addresses/");
  } catch {
    return readLocal();
  }
};

export const saveAddress = async (address: Address): Promise<Address> => {
  try {
    return await apiClient<Address>("/addresses/", { method: "POST", body: JSON.stringify(address) });
  } catch {
    const list = readLocal();
    const index = list.findIndex((item) => item.id === address.id);
    if (index >= 0) list[index] = address;
    else list.push(address);
    writeLocal(list);
    return address;
  }
};

export const deleteAddress = async (id: string): Promise<void> => {
  try {
    await apiClient<void>(`/addresses/${id}/`, { method: "DELETE" });
  } catch {
    writeLocal(readLocal().filter((item) => item.id !== id));
  }
};
