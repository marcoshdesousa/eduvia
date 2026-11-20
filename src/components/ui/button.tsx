import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-gradient-to-b from-[#12a273] to-primary text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-inset ring-white/15 hover:brightness-110 dark:from-primary dark:to-[#22b886]",
  secondary: "bg-primary/10 text-primary hover:bg-primary/15",
  outline: "border border-border bg-surface text-foreground shadow-sm hover:border-primary/40 hover:bg-primary/5",
  ghost: "bg-transparent hover:bg-foreground/5",
  danger: "bg-gradient-to-b from-[#ef4444] to-danger text-white shadow-lg shadow-danger/25 hover:brightness-110",
};
const sizes: Record<Size, string> = {
  sm: "h-9 rounded-full px-3.5 text-sm",
  md: "h-11 rounded-full px-5 text-sm",
  lg: "h-13 rounded-2xl px-6 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }>(
  ({ className, variant, size, ...props }, ref) => <button ref={ref} className={buttonClass(variant, size, className)} {...props} />,
);
Button.displayName = "Button";
