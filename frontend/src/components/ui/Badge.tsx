import { cn } from "@/lib/utils/cn";
import type { PropsWithChildren } from "react";

export const Badge = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return <span className={cn("badge", className)}>{children}</span>;
};
