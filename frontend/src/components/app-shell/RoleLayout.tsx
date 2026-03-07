import Link from "next/link";
import type { PropsWithChildren } from "react";

export const RoleLayout = ({
  title,
  links,
  children,
}: PropsWithChildren<{ title: string; links: { label: string; href: string }[] }>) => (
  <div className="role-layout container">
    <aside>
      <h1>{title}</h1>
      <nav>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
    <main>{children}</main>
  </div>
);
