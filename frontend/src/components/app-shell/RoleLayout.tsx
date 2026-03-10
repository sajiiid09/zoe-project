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
    <div className="app-shell">
      <DashboardSidebar title={title} links={links} />
      <div className="app-main-wrapper">
        <DashboardNavbar />
        <main className="app-content">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
