import type { PropsWithChildren } from "react";

import { StoreFooter } from "@/components/app-shell/StoreFooter";
import { StoreHeader } from "@/components/app-shell/StoreHeader";

export default function StorefrontLayout({ children }: PropsWithChildren) {
  return (
    <>
      <StoreHeader />
      {children}
      <StoreFooter />
    </>
  );
}
