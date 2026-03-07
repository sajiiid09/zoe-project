"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

export const RoleLayout = ({
  title,
  links,
  children,
}: PropsWithChildren<{ title: string; links: { label: string; href: string }[] }>) => {
  const pathname = usePathname();

  return (
  <div className="role-layout container">
    <aside>
      <h1 style={{ fontSize: "1.25rem", margin: "0 0 1rem 0" }}>{title}</h1>
      <nav>
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              style={{
                backgroundColor: isActive ? "var(--surface-muted)" : "transparent",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--ink)" : "var(--ink-muted)",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
    <main>{children}</main>
  </div>
  );
};
