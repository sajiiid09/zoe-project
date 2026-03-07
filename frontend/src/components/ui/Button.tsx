import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
  }
>;

const variantStyles = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
};

const sizeStyles = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => {
  return (
    <button className={cn(variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </button>
  );
};
