import * as React from "react";
import { cn } from "cn";

import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

function DashboardStat({
  label,
  value,
  description,
  icon,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card size="sm" className={className}>
      <CardContent className="gap-2">
        <div className="flex items-center justify-between gap-2">
          <CardDescription>{label}</CardDescription>
          {icon ? (
            <span className="shrink-0 text-muted-foreground">{icon}</span>
          ) : null}
        </div>
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        {description ? (
          <span className="text-xs text-muted-foreground">{description}</span>
        ) : null}
      </CardContent>
    </Card>
  );
}

const statGridColumns = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

function DashboardStatGrid({
  columns = 4,
  className,
  children,
}: {
  columns?: keyof typeof statGridColumns;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("grid gap-4", statGridColumns[columns], className)}
    >
      {children}
    </div>
  );
}

export { DashboardStat, DashboardStatGrid };