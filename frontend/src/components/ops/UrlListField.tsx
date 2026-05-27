"use client";

import { ImageBroken, Plus, TrayArrowUp, Trash } from "@phosphor-icons/react";
import { useId, useRef, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/Button";
import {
  uploadVendorMedia,
  type VendorMediaScope,
} from "@/lib/api/vendorMedia";

type UrlListFieldProps = {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  hint?: string;
  maxItems?: number;
  uploadScope?: VendorMediaScope;
  uploadLabel?: string;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
};

const normalize = (values: string[]) =>
  values.map((value) => value.trim()).filter(Boolean);

export const UrlListField = ({
  label,
  values,
  onChange,
  hint,
  maxItems = 6,
  uploadScope,
  uploadLabel,
  disabled = false,
  onUploadingChange,
}: UrlListFieldProps) => {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const items = values.length ? values : [""];
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const updateAt = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(normalize(next));
  };

  const removeAt = (index: number) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index);
    onChange(normalize(next));
  };

  const addItem = () => {
    onChange([...normalize(items), ""]);
  };

  const setUploadingState = (next: boolean) => {
    setIsUploading(next);
    onUploadingChange?.(next);
  };

  const handleFilesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const scope = uploadScope;
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!scope || !selectedFiles.length) {
      return;
    }

    const currentItems = normalize(items);
    const availableSlots = Math.max(0, maxItems - currentItems.length);

    if (maxItems === 1 && selectedFiles.length > 0) {
      setUploadingState(true);
      setUploadError("");
      setUploadProgress(0);

      try {
        const uploadedUrl = await uploadVendorMedia(
          selectedFiles[0],
          scope,
          setUploadProgress
        );
        onChange([uploadedUrl]);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Upload failed."
        );
      } finally {
        setUploadingState(false);
        event.target.value = "";
      }

      return;
    }

    if (selectedFiles.length > availableSlots) {
      setUploadError(`You can upload up to ${maxItems} images in this field.`);
      event.target.value = "";
      return;
    }

    setUploadingState(true);
    setUploadError("");
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];

      for (let index = 0; index < selectedFiles.length; index += 1) {
        const file = selectedFiles[index];
        const uploadedUrl = await uploadVendorMedia(file, scope, (percent) => {
          const overall =
            Math.round(((index + percent / 100) / selectedFiles.length) * 100);
          setUploadProgress(overall);
        });
        uploadedUrls.push(uploadedUrl);
      }

      onChange([...currentItems, ...uploadedUrls].slice(0, maxItems));
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Upload failed."
      );
    } finally {
      setUploadingState(false);
      event.target.value = "";
    }
  };

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      {uploadScope ? (
        <div className="upload-inline">
          <input
            id={fileInputId}
            ref={fileInputRef}
            className="upload-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={maxItems > 1}
            onChange={handleFilesSelected}
            disabled={disabled || isUploading}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={
              disabled ||
              isUploading ||
              (maxItems > 1 && normalize(items).length >= maxItems)
            }
            onClick={() => fileInputRef.current?.click()}
          >
            <TrayArrowUp size={16} weight="bold" />
            {isUploading
              ? `Uploading ${uploadProgress}%`
              : uploadLabel || (maxItems === 1 ? "Upload image" : "Upload images")}
          </Button>
          {maxItems > 1 ? (
            <span className="field-hint">You can upload up to {maxItems} images.</span>
          ) : (
            <span className="field-hint">Upload replaces the current image.</span>
          )}
        </div>
      ) : null}
      <div className="url-list-field">
        {items.map((value, index) => {
          const src = value.trim();
          return (
            <div className="url-list-item" key={`${label}-${index}-${src || "blank"}`}>
              <div className="url-list-input-row">
                <input
                  className="field-input"
                  type="url"
                  value={value}
                  placeholder="https://example.com/image.jpg"
                  onChange={(event) => updateAt(index, event.target.value)}
                  disabled={disabled || isUploading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled || isUploading || (items.length <= 1 && !src)}
                  onClick={() => removeAt(index)}
                >
                  <Trash size={16} weight="bold" />
                </Button>
              </div>
              <div className="url-list-preview">
                {src ? (
                  // URL previews are user-entered arbitrary remotes, so plain img is the pragmatic choice here.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={`${label} preview ${index + 1}`} />
                ) : (
                  <div className="url-list-empty">
                    <ImageBroken size={18} weight="bold" />
                    <span>Add an image URL to preview it.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {uploadError ? <span className="form-error">{uploadError}</span> : null}
      {hint ? <span className="field-hint">{hint}</span> : null}
      {maxItems > 1 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled || isUploading || normalize(items).length >= maxItems}
          onClick={addItem}
        >
          <Plus size={16} weight="bold" />
          Add image URL
        </Button>
      ) : null}
    </div>
  );
};
