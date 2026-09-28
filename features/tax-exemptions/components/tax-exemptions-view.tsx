"use client";

import { FileCheck2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { useTaxExemptions } from "../hooks/use-tax-exemptions";

export function TaxExemptionsView() {
  const t = useTranslations("dashboard.taxExemptions");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  const term = debouncedSearch.trim().toLowerCase();

  const query = useTaxExemptions();
  const categories = query.data ?? [];

  const filtered = term
    ? categories
        .map((category) => ({
          ...category,
          codes: category.codes.filter(
            (code) =>
              code.code.toLowerCase().includes(term) ||
              code.englishReason.toLowerCase().includes(term) ||
              code.arabicReason.includes(term) ||
              category.description.toLowerCase().includes(term),
          ),
        }))
        .filter(
          (category) =>
            category.codes.length > 0 ||
            category.description.toLowerCase().includes(term),
        )
    : categories;

  return (
    <div className="flex flex-col gap-4">
      <InputGroup className="w-full sm:w-80">
        <InputGroupInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchLabel")}
        />
      </InputGroup>

      {query.isError ? (
        <Alert variant="destructive">
          <AlertTitle>{t("errorTitle")}</AlertTitle>
          <AlertDescription>{t("errorDescription")}</AlertDescription>
        </Alert>
      ) : query.isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 w-full animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <DashboardSection>
          <Empty className="py-16">
            <EmptyMedia variant="icon">
              <FileCheck2 />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
              <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
            </EmptyHeader>
            {search ? (
              <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
                {t("clearSearch")}
              </Button>
            ) : null}
          </Empty>
        </DashboardSection>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((category) => (
            <DashboardSection
              key={category.categoryId}
              title={t("category", { id: category.categoryId })}
              description={category.description}
            >
              <ul className="flex flex-col divide-y">
                {category.codes.map((code) => (
                  <li
                    key={code.code}
                    className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-4"
                  >
                    <Badge
                      variant="secondary"
                      className="w-fit shrink-0 font-mono tabular-nums"
                    >
                      {code.code}
                    </Badge>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm">{code.englishReason}</span>
                      <span
                        dir="rtl"
                        lang="ar"
                        className="text-sm text-muted-foreground"
                      >
                        {code.arabicReason}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </DashboardSection>
          ))}
        </div>
      )}
    </div>
  );
}
