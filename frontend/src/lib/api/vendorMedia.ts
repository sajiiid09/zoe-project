import { apiClient } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/response";

export type VendorMediaScope =
  | "product"
  | "submission"
  | "store_logo"
  | "store_banner";

type VendorMediaSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  uploadUrl: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: {
    message?: string;
  };
};

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const ensureSupportedFile = (file: File) => {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, and WebP images are allowed.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Each image must be 10 MB or smaller.");
  }
};

const getVendorMediaSignature = async (
  scope: VendorMediaScope,
  filename: string
): Promise<VendorMediaSignature> => {
  const response = await apiClient<ApiEnvelope<VendorMediaSignature>>("/vendor/media/sign", {
    method: "POST",
    body: JSON.stringify({ scope, filename }),
  });

  if (!response.data) {
    throw new Error("Upload signature response was empty.");
  }

  return response.data;
};

export const uploadVendorMedia = async (
  file: File,
  scope: VendorMediaScope,
  onProgress?: (percent: number) => void
): Promise<string> => {
  ensureSupportedFile(file);

  const signature = await getVendorMediaSignature(scope, file.name);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  formData.append("public_id", signature.publicId);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", signature.uploadUrl);

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    });

    xhr.addEventListener("load", () => {
      try {
        const parsed = JSON.parse(xhr.responseText || "{}") as CloudinaryUploadResponse;

        if (xhr.status >= 200 && xhr.status < 300 && parsed.secure_url) {
          onProgress?.(100);
          resolve(parsed.secure_url);
          return;
        }

        reject(new Error(parsed.error?.message || "Cloudinary upload failed."));
      } catch {
        reject(new Error("Cloudinary upload returned an invalid response."));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Cloudinary upload failed. Check your network and try again."));
    });

    xhr.send(formData);
  });
};
