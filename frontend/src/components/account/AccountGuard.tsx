"use client";

import { RoleGuard } from "@/components/account/RoleGuard";

export const AccountGuard = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard role="customer">{children}</RoleGuard>;
};
