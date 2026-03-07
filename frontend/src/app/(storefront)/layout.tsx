import type { PropsWithChildren } from "react";
import { Suspense } from "react";

import { StoreFooter } from "@/components/app-shell/StoreFooter";
import { StoreHeader } from "@/components/app-shell/StoreHeader";

export default function StorefrontLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Suspense fallback={<div className="store-header-skeleton" />}>
        <StoreHeader />
      </Suspense>
      {children}
      <StoreFooter />
    </>
  );
}
