"use client";

import { Building2, Search, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DataTable,
  DataTableColumn,
} from "@/features/dashboard/components/data-table";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { useTaxpayers } from "../hooks/use-taxpayers";
import { TaxpayerResponse } from "../types";

export default function TaxpayersView() {
  const t = useTranslations("dashboard.taxpayers");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);

  const query = useTaxpayers(debouncedSearch);

  const columns: DataTableColumn<TaxpayerResponse>[] = [
    {
      key: "name",
      header: t("colName"),
      cell: (taxpayer) => (
        <span className="font-medium">{taxpayer.legalName}</span>
      ),
    },
    {
      key: "vat",
      header: t("colVat"),
      cell: (taxpayer) => (
        <span className="text-muted-foreground tabular-nums">
          {taxpayer.vat}
        </span>
      ),
    },
    {
      key: "crn",
      header: t("colCrn"),
      cell: (taxpayer) => (
        <span className="text-muted-foreground tabular-nums">
          {taxpayer.crn}
        </span>
      ),
    },
    {
      key: "vatGroup",
      header: t("colVatGroup"),
      cell: (taxpayer) =>
        taxpayer.isVatGroup ? (
          <Badge variant="secondary">{t("vatGroup")}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "city",
      header: t("colCity"),
      cell: (taxpayer) => (
        <span className="text-muted-foreground">
          {taxpayer.address.cityName}
        </span>
      ),
    },
    {
      key: "devices",
      header: t("colDevices"),
      align: "end",
      cell: (taxpayer) => (
        <span className="tabular-nums">{taxpayer.devicesCount}</span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputGroup className="w-full sm:w-72">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchLabel")}
          />
        </InputGroup>

        {search ? (
          <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
            <SearchX />
            {t("clearFilters")}
          </Button>
        ) : null}
      </div>

      <DashboardSection contentClassName="p-0">
        <DataTable
          columns={columns}
          items={query.data}
          getRowId={(taxpayer) => taxpayer.id}
          loading={query.isLoading}
          fetching={query.isFetching}
          error={query.isError}
          errorTitle={t("errorTitle")}
          errorDescription={t("errorDescription")}
          empty={{
            icon: <Building2 />,
            title: t("emptyTitle"),
            description: t("emptyDescription"),
          }}
        />
      </DashboardSection>
    </div>
  );
}