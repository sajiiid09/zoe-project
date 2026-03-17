"use client";

import { ImageBroken, Plus, Trash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";

type UrlListFieldProps = {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  hint?: string;
  maxItems?: number;
};

const normalize = (values: string[]) =>
  values.map((value) => value.trim()).filter(Boolean);

export const UrlListField = ({
  label,
  values,
  onChange,
  hint,
  maxItems = 6,
}: UrlListFieldProps) => {
  const items = values.length ? values : [""];

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

  return (
    <div className="field">
      <span className="field-label">{label}</span>
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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={items.length <= 1 && !src}
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
      {hint ? <span className="field-hint">{hint}</span> : null}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={normalize(items).length >= maxItems}
        onClick={addItem}
      >
        <Plus size={16} weight="bold" />
        Add image URL
      </Button>
    </div>
  );
};
