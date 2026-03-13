import { apiClient } from "@/lib/api/client";
import { unwrapApiData, type ApiEnvelope } from "@/lib/api/response";

type CheckoutSessionPayload = {
  url: string;
  sessionId: string;
};

type PaymentStatusPayload = {
  paid: boolean;
};

const createFeeSession = async (
  path: "/payments/vendor-fee" | "/payments/affiliate-fee"
) => {
  const response = await apiClient<ApiEnvelope<CheckoutSessionPayload>>(path, {
    method: "POST",
  });

  return unwrapApiData(response, { url: "", sessionId: "" });
};

const verifyFeeSession = async (
  path: "/payments/vendor-fee/verify" | "/payments/affiliate-fee/verify",
  sessionId: string
) => {
  await apiClient<ApiEnvelope<unknown>>(path, {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
};

const getFeeStatus = async (
  path: "/payments/vendor-fee/status" | "/payments/affiliate-fee/status"
) => {
  const response = await apiClient<ApiEnvelope<PaymentStatusPayload>>(path);
  return unwrapApiData(response, { paid: false }).paid;
};

export const createVendorFeeSession = () => createFeeSession("/payments/vendor-fee");

export const verifyVendorFeeSession = (sessionId: string) =>
  verifyFeeSession("/payments/vendor-fee/verify", sessionId);

export const getVendorFeeStatus = () => getFeeStatus("/payments/vendor-fee/status");

export const createAffiliateFeeSession = () => createFeeSession("/payments/affiliate-fee");

export const verifyAffiliateFeeSession = (sessionId: string) =>
  verifyFeeSession("/payments/affiliate-fee/verify", sessionId);

export const getAffiliateFeeStatus = () => getFeeStatus("/payments/affiliate-fee/status");
