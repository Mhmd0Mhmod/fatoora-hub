import * as React from "react";
import { cn } from "cn";

function DashboardPageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

function DashboardPageLayout({
  title,
  subtitle,
  actions,
  toolbar,
  children,
  className,
  toolbarClassName,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  toolbarClassName?: string;
}) {
  return (
    <div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
      <DashboardPageHeader title={title} subtitle={subtitle} actions={actions} />
      {toolbar ? (
        <div
          className={cn(
            "flex flex-col gap-3 sm:flex-row sm:items-center",
            toolbarClassName,
          )}
        >
          {toolbar}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export { DashboardPageHeader, DashboardPageLayout };