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
    <aside className="w-64 flex-shrink-0 h-full flex flex-col glass-card border-r border-white/40 z-10 hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-50/40 to-transparent pointer-events-none" />

      <div className="p-6 border-b border-white/30 relative z-10">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
          {title}
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-5 px-4 space-y-2 relative z-10">
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
              className="relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabSidebar"
                  className="absolute inset-0 bg-white shadow-[0_4px_16px_rgba(40,116,115,0.08)] border border-white/60 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <Link
                href={link.href}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 z-10",
                  isActive
                    ? "text-emerald-800"
                    : "text-slate-500 hover:text-emerald-700 hover:bg-white/40",
                )}
              >
                {Icon && (
                  <Icon
                    weight={isActive ? "fill" : "regular"}
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-emerald-500" : "text-slate-400",
                    )}
                  />
                )}
                <span>{link.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
};
