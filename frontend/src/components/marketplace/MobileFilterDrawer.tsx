"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Drawer } from "@/components/ui/Drawer";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";

export const MobileFilterDrawer = ({ q }: { q?: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="mobile-filter-btn" onClick={() => setOpen(true)}>
        <SlidersHorizontal size={16} /> Filters
      </button>
      <Drawer title="Filters" open={open} onClose={() => setOpen(false)}>
        <FilterSidebar q={q} />
      </Drawer>
    </>
  );
};
