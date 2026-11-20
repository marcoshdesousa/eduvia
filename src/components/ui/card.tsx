import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-3xl border border-border/60 bg-surface/85 p-4 shadow-[0_1px_2px_rgba(4,32,24,0.05),0_16px_40px_-24px_rgba(4,32,24,0.35)] backdrop-blur-xl sm:p-5 dark:shadow-[0_0_0_1px_rgba(46,230,166,0.04),0_20px_40px_-24px_rgba(0,0,0,0.9)]", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-base font-bold tracking-tight", className)} {...props} />;
}

export function Stat({ label, value, hint, className }: { label: string; value: React.ReactNode; hint?: React.ReactNode; className?: string }) {
  return (
    <Card className={className ? `p-4 ${className}` : "p-4"}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-2xl font-extrabold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </Card>
  );
}
