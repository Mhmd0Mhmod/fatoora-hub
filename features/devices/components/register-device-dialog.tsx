"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterDevice } from "@/features/dashboard/hooks/use-devices";
import {
  DeviceInvoicingType,
  ZatcaEnvironment,
} from "@/features/dashboard/types";

const EMPTY = {
  otp: "",
  commonName: "",
  location: "",
  industry: "",
  organizationUnitName: "",
};

const invoicingTypes: DeviceInvoicingType[] = ["Standard", "Simplified", "Both"];
const environments: ZatcaEnvironment[] = ["Simulation", "Production"];

export function RegisterDeviceDialog({ taxpayerId }: { taxpayerId: string }) {
  const t = useTranslations("dashboard.devices.register");
  const register = useRegisterDevice(taxpayerId);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [invoicingType, setInvoicingType] = useState<DeviceInvoicingType>(
    "Standard",
  );
  const [environment, setEnvironment] = useState<ZatcaEnvironment>(
    "Simulation",
  );

  const isValid = Boolean(
    form.otp.trim() &&
      form.commonName.trim() &&
      form.location.trim() &&
      form.industry.trim() &&
      form.organizationUnitName.trim(),
  );

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(EMPTY);
      register.reset();
    }
  }

  function handleSubmit() {
    register.mutate(
      {
        otp: form.otp.trim(),
        commonName: form.commonName.trim(),
        location: form.location.trim(),
        industry: form.industry.trim(),
        organizationUnitName: form.organizationUnitName.trim(),
        invoiceType: invoicingType,
        environment,
      },
      {
        onSuccess: () => {
          toast.success(t("success"));
          setOpen(false);
          setForm(EMPTY);
        },
        onError: (error) => {
          const detail =
            (error as { response?: { data?: { detail?: string } } })?.response
              ?.data?.detail ?? t("error");

          toast.error(detail);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="sm:ms-auto">
          <Plus />
          {t("trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {register.isError ? (
          <Alert variant="destructive">
            <AlertTitle>{t("errorTitle")}</AlertTitle>
            <AlertDescription>{t("error")}</AlertDescription>
          </Alert>
        ) : null}

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="device-otp">{t("otp")}</FieldLabel>
            <Input
              id="device-otp"
              value={form.otp}
              onChange={(e) => set("otp", e.target.value)}
              dir="ltr"
              autoComplete="one-time-code"
            />
            <FieldDescription>{t("otpDescription")}</FieldDescription>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="device-common-name">
                {t("commonName")}
              </FieldLabel>
              <Input
                id="device-common-name"
                value={form.commonName}
                onChange={(e) => set("commonName", e.target.value)}
                placeholder="T1-EGS-01"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="device-organization">
                {t("organizationUnitName")}
              </FieldLabel>
              <Input
                id="device-organization"
                value={form.organizationUnitName}
                onChange={(e) => set("organizationUnitName", e.target.value)}
                placeholder="300000000000003"
                inputMode="numeric"
                dir="ltr"
              />
              <FieldDescription>
                {t("organizationUnitNameDescription")}
              </FieldDescription>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="device-location">{t("location")}</FieldLabel>
              <Input
                id="device-location"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Riyadh"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="device-industry">{t("industry")}</FieldLabel>
              <Input
                id="device-industry"
                value={form.industry}
                onChange={(e) => set("industry", e.target.value)}
                placeholder="Retail"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>{t("invoicingType")}</FieldLabel>
              <Select
                value={invoicingType}
                onValueChange={(value) =>
                  setInvoicingType(value as DeviceInvoicingType)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  {invoicingTypes.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`invoicingType.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>{t("environment")}</FieldLabel>
              <Select
                value={environment}
                onValueChange={(value) =>
                  setEnvironment(value as ZatcaEnvironment)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  {environments.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`environment.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </FieldGroup>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={register.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || register.isPending}
          >
            {register.isPending ? t("registering") : t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
