"use client";

import type { PropsWithChildren } from "react";
import { DashboardSidebar, type DashboardLink } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";

export const RoleLayout = ({
  title,
  links,
  children,
}: PropsWithChildren<{ title: string; links: DashboardLink[] }>) => {
  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-800 bg-[#f4f7fa]">
      <DashboardSidebar title={title} links={links} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative z-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
