"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/Button";

type AuthStatusDialogProps = {
  open: boolean;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  onClose: () => void;
};

export const AuthStatusDialog = ({
  open,
  title,
  description,
  actionHref,
  actionLabel,
  onClose,
}: AuthStatusDialogProps) => {
  const actionRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    actionRef.current?.focus();

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="auth-dialog-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="auth-dialog-kicker">Action required</div>
        <h2 id="auth-dialog-title">{title}</h2>
        <p>{description}</p>
        <div className="auth-dialog-actions">
          <Link
            href={actionHref}
            ref={actionRef}
            className="auth-dialog-primary"
            onClick={onClose}
          >
            {actionLabel}
          </Link>
          <Button variant="ghost" type="button" onClick={onClose}>
            Continue browsing
          </Button>
        </div>
      </section>
    </div>
  );
};
