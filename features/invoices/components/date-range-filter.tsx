"use client";

import { formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}) {
  const t = useTranslations("dashboard.invoices");
  const [open, setOpen] = useState(false);

  const label =
    value?.from && value?.to
      ? `${formatDate(value.from, "PP")} — ${formatDate(value.to, "PP")}`
      : value?.from
        ? t("dateRangeFrom", { date: formatDate(value.from, "PP") })
        : t("dateRange");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start sm:w-52"
        >
          <CalendarIcon />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={value?.from}
          selected={value}
          onSelect={(range) => {
            onChange(range);
            // A complete range is a deliberate choice, so close on the
            // second click; a single click should keep the calendar open.
            if (range?.from && range?.to) setOpen(false);
          }}
        />

        <Separator />

        <div className="flex items-center justify-between gap-2 p-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={!value}
            onClick={() => onChange(undefined)}
          >
            {t("dateRangeClear")}
          </Button>
          <Button
            size="sm"
            disabled={!value?.from || !value?.to}
            onClick={() => setOpen(false)}
          >
            {t("dateRangeApply")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
