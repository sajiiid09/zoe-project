"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export const RoleLayout = ({
  title,
  links,
  children,
}: PropsWithChildren<{ title: string; links: { label: string; href: string }[] }>) => {
  const pathname = usePathname();

  return (
    <div className="role-layout container">
      <aside className="role-sidebar glass-card">
        <h1 className="role-title">{title}</h1>
        <nav className="role-nav">
          {links.map((link, index) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.26, delay: index * 0.02 }}
              >
                <Link
                  href={link.href}
                  className={cn("role-link", isActive && "role-link-active")}
                >
                  <span>{link.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </aside>
      <main className="role-main glass-card">{children}</main>
    </div>
  );
};
