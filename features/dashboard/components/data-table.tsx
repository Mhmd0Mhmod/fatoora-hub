"use client";

import * as React from "react";
import { cn } from "cn";
import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TablePagination, TablePaginationProps } from "./table-pagination";

export type DataTableColumnAlign = "start" | "end" | "center";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  align?: DataTableColumnAlign;
  className?: string;
  headerClassName?: string;
}

export interface DataTableEmpty {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  items: T[];
  getRowId: (item: T) => string | number;
  loading?: boolean;
  fetching?: boolean;
  empty?: DataTableEmpty;
  error?: boolean;
  errorTitle?: React.ReactNode;
  errorDescription?: React.ReactNode;
  pagination?: TablePaginationProps;
  skeletonRows?: number;
  onRowClick?: (item: T) => void;
  className?: string;
  tableClassName?: string;
}

const alignClass: Record<DataTableColumnAlign, string> = {
  start: "text-start",
  end: "text-end",
  center: "text-center",
};

function DataTableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full rounded-md" />
      ))}
    </div>
  );
}

function DataTable<T>({
  columns,
  items,
  getRowId,
  loading = false,
  fetching = false,
  empty,
  error = false,
  errorTitle,
  errorDescription,
  pagination,
  skeletonRows = 6,
  onRowClick,
  className,
  tableClassName,
}: DataTableProps<T>) {
  const isEmpty = !loading && !error && items.length === 0;

  return (
    <div className={className}>
      {loading ? (
        <DataTableSkeleton rows={skeletonRows} />
      ) : error ? (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTriangle className="shrink-0" />
            {errorTitle ? <AlertTitle>{errorTitle}</AlertTitle> : null}
            {errorDescription ? (
              <AlertDescription>{errorDescription}</AlertDescription>
            ) : null}
          </Alert>
        </div>
      ) : isEmpty && empty ? (
        <Empty className={cn("py-16", empty.className)}>
          {empty.icon ? (
            <EmptyMedia variant="icon">{empty.icon}</EmptyMedia>
          ) : null}
          <EmptyHeader>
            <EmptyTitle>{empty.title}</EmptyTitle>
            {empty.description ? (
              <EmptyDescription>{empty.description}</EmptyDescription>
            ) : null}
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <Table className={cn(fetching && "opacity-60", tableClassName)}>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      alignClass[column.align ?? "start"],
                      column.headerClassName,
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={getRowId(item)}
                  className={cn(onRowClick && "cursor-pointer")}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        alignClass[column.align ?? "start"],
                        column.className,
                      )}
                    >
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && items.length > 0 ? (
            <TablePagination {...pagination} />
          ) : null}
        </>
      )}
    </div>
  );
}

export { DataTable };