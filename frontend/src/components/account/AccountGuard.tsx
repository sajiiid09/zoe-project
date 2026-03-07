"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

export const AccountGuard = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!session) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (session.user.role !== "customer") {
      router.replace("/");
    }
  }, [session, router, pathname]);

  if (!session || session.user.role !== "customer") {
    return <section className="state-box"><p>Checking account access...</p></section>;
  }

  return <>{children}</>;
};
