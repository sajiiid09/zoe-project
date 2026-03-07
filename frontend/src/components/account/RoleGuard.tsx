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
    return <section className="state-box"><p>Checking access...</p></section>;
  }

  return <>{children}</>;
};
