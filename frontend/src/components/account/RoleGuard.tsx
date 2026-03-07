"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/roles";

export const RoleGuard = ({ role, children }: { role: Exclude<UserRole, "guest">; children: React.ReactNode }) => {
  const { session } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (session.user.role !== role) {
      router.replace("/");
    }
  }, [session, role, pathname, router]);

  if (!session || session.user.role !== role) {
    return (
      <div className="container page-space">
        <section className="state-box" style={{ padding: "4rem 2rem", opacity: 0.7 }}>
          <div style={{ width: 24, height: 24, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
          <p className="muted">Checking access...</p>
        </section>
      </div>
    );
  }

  return <>{children}</>;
};
