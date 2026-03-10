"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ElementType } from "react";

export type DashboardLink = {
  label: string;
  href: string;
  icon?: ElementType;
};

export const DashboardSidebar = ({
  title,
  links,
}: {
  title: string;
  links: DashboardLink[];
}) => {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-header">
        <h1 className="app-sidebar-title">{title}</h1>
      </div>
      <nav className="app-sidebar-nav">
        {links.map((link, index) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;

          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.04,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              <Link
                href={link.href}
                className={`app-nav-link ${isActive ? 'active' : ''}`}
              >
                {isActive && (
                  <>
                    <motion.div
                      layoutId="activeTabSidebar"
                      className="app-nav-active-bg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                    <div className="app-nav-active-indicator" />
                  </>
                )}
                {Icon && (
                  <Icon
                    weight={isActive ? "fill" : "regular"}
                    className="app-nav-icon"
                  />
                )}
                <span>{link.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
};
