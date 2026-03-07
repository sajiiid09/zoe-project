"use client";

import { X } from "@phosphor-icons/react";
import type { PropsWithChildren } from "react";

export const Drawer = ({
  title,
  open,
  onClose,
  children,
}: PropsWithChildren<{ title: string; open: boolean; onClose: () => void }>) => {
  if (!open) return null;

  return (
    <div className="drawer-backdrop" role="presentation" onClick={onClose}>
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <header className="drawer-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close panel" className="icon-btn">
            <X size={20} weight="bold" />
          </button>
        </header>
        <div className="drawer-content">{children}</div>
      </aside>
    </div>
  );
};
