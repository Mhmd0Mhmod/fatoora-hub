"use client";

import { formatDate } from "date-fns";
import { Monitor, Search, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import {
  DeviceInvoicingType,
  DevicePhaseType,
  ZatcaEnvironment,
} from "../../dashboard/types";
import { useDeviceHealth } from "../../dashboard/hooks/use-device-health";
import { useDevices } from "../../dashboard/hooks/use-devices";
import { Device } from "../types";
import { RegisterDeviceDialog } from "./register-device-dialog";
import { RenewCertificateDialog } from "./renew-certificate-dialog";

const environments: ZatcaEnvironment[] = ["Simulation", "Production"];

const phases: DevicePhaseType[] = ["Compliance", "Production"];

const invoicingTypes: DeviceInvoicingType[] = [
  "Standard",
  "Simplified",
  "Both",
];

const SKELETON_CARDS = 6;

function DevicesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: SKELETON_CARDS }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function DevicesView({ taxpayerId }: { taxpayerId: string }) {
  const t = useTranslations("dashboard.devices");

  const [search, setSearch] = useState("");
  const [environment, setEnvironment] = useState<ZatcaEnvironment | "all">(
    "all",
  );
  const [phase, setPhase] = useState<DevicePhaseType | "all">("all");
  const [invoicingType, setInvoicingType] = useState<
    DeviceInvoicingType | "all"
  >("all");

  const debouncedSearch = useDebouncedValue(search, 350);
  const trimmedSearch = debouncedSearch.trim();

  const hasFilters =
    trimmedSearch !== "" ||
    environment !== "all" ||
    phase !== "all" ||
    invoicingType !== "all";

  const query = useDevices(
    taxpayerId,
    useMemo(
      () => ({
        ...(trimmedSearch ? { searchTerm: trimmedSearch } : {}),
        ...(environment !== "all" ? { environment } : {}),
        ...(phase !== "all" ? { phase } : {}),
        ...(invoicingType !== "all" ? { invoicingType } : {}),
      }),
      [trimmedSearch, environment, phase, invoicingType],
    ),
  );

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

        <Select
          value={environment}
          onValueChange={(value) =>
            setEnvironment(value as ZatcaEnvironment | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t("allEnvironments")} />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="all">{t("allEnvironments")}</SelectItem>
            {environments.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`environment.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={phase}
          onValueChange={(value) => setPhase(value as DevicePhaseType | "all")}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t("allPhases")} />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="all">{t("allPhases")}</SelectItem>
            {phases.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`phase.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={invoicingType}
          onValueChange={(value) =>
            setInvoicingType(value as DeviceInvoicingType | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t("allInvoicingTypes")} />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="all">{t("allInvoicingTypes")}</SelectItem>
            {invoicingTypes.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`invoicingType.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setEnvironment("all");
              setPhase("all");
              setInvoicingType("all");
            }}
          >
            <SearchX />
            {t("clearFilters")}
          </Button>
        ) : null}

        <RegisterDeviceDialog taxpayerId={taxpayerId} />
      </div>

      {query.isLoading ? (
        <DevicesGridSkeleton />
      ) : query.isError ? (
        <Alert variant="destructive">
          <AlertTitle>{t("errorTitle")}</AlertTitle>
          <AlertDescription>{t("errorDescription")}</AlertDescription>
        </Alert>
      ) : query.data.length === 0 ? (
        <Empty className="py-16">
          <EmptyMedia variant="icon">
            <Monitor />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div
          className={`grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${
            query.isFetching ? "opacity-60" : ""
          }`}
        >
          {query.data.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  );
}

export { DevicesGridSkeleton };

function DeviceCard({ device }: { device: Device }) {
  const t = useTranslations("dashboard.devices");
  const health = useDeviceHealth(device.id);

  return (
    <Card size="sm" className="gap-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Monitor className="size-4" />
          </span>
          <div className="min-w-0">
            <CardTitle className="truncate">{device.name}</CardTitle>
            <CardDescription className="truncate font-mono text-xs">
              {device.egsSerialNumber}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-wrap flex-row gap-1.5">
        <Badge
          variant={device.currentPhase === "Production" ? "default" : "outline"}
        >
          {t(`phase.${device.currentPhase}`)}
        </Badge>
        <Badge variant="secondary">
          {t(`environment.${device.environment}`)}
        </Badge>
        <Badge variant="outline">
          {t(`invoicingType.${device.invoicingType}`)}
        </Badge>
        {health.data ? (
          <Badge
            variant={health.data.isExpired ? "destructive" : "outline"}
            className={
              health.data.isExpiringSoon && !health.data.isExpired
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : undefined
            }
          >
            {health.data.isExpired
              ? t("certExpired")
              : health.data.daysUntilExpiry !== null
                ? t("certExpiresIn", { days: health.data.daysUntilExpiry })
                : t("certActive")}
          </Badge>
        ) : null}
      </CardContent>

      <CardFooter className="border-t text-xs text-muted-foreground">
        <span>{t("colCreated")}</span>
        <span className="ms-auto tabular-nums">
          {formatDate(device.createdAtUtc, "P")}
        </span>
        <RenewCertificateDialog deviceId={device.id} deviceName={device.name} />
      </CardFooter>
    </Card>
  );
}
