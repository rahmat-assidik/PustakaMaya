import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  trend?: string;
  direction?: "up" | "down" | "flat";
  icon: LucideIcon;
  tint?: "blue" | "orange" | "green" | "violet";
};

const tintClasses = {
  blue: "bg-secondary/25 text-secondary-foreground",
  orange: "bg-accent/15 text-accent-foreground",
  green: "bg-secondary/15 text-secondary-foreground",
  violet: "bg-muted text-foreground",
};

export function MetricCard({
  label,
  value,
  detail,
  trend,
  direction = "flat",
  icon: Icon,
  tint = "blue",
}: MetricCardProps) {
  return (
    <Card className="gap-0 border-border/80 shadow-none">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-3 text-[1.7rem] leading-none font-semibold tracking-tight tabular-nums">
              {value}
            </p>
          </div>
          <span className={`inline-flex size-9 shrink-0 items-center justify-center rounded-xl ${tintClasses[tint]}`}>
            <Icon aria-hidden="true" className="size-[18px]" />
          </span>
        </div>
        <div className="mt-4 flex min-h-5 items-center gap-1.5 text-xs">
          {trend ? (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${direction === "down" ? "text-accent-foreground" : "text-secondary-foreground"}`}
            >
              {direction === "down" ? (
                <ArrowDownRight aria-hidden="true" className="size-3.5" />
              ) : (
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              )}
              {trend}
            </span>
          ) : null}
          <span className="text-muted-foreground">{detail}</span>
        </div>
      </CardContent>
    </Card>
  );
}
