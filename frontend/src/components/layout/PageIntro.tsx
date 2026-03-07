import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type Props = {
  title: string;
  description: string;
  crumbs?: { label: string; href?: string }[];
  rightSlot?: ReactNode;
};

export const PageIntro = ({ title, description, crumbs, rightSlot }: Props) => (
  <section className="page-intro">
    {crumbs ? <Breadcrumbs items={crumbs} /> : null}
    <div className="page-intro-row">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {rightSlot}
    </div>
  </section>
);
