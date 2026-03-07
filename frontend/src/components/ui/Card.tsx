import { cn } from "@/lib/utils/cn";
import type { PropsWithChildren } from "react";

export const Card = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return <article className={cn("card", className)}>{children}</article>;
};
