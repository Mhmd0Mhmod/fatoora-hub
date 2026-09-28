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
import { useCreateTaxpayer } from "@/features/dashboard/hooks/use-taxpayers";

const EMPTY = {
  vat: "",
  crn: "",
  legalName: "",
  streetName: "",
  buildingNumber: "",
  citySubdivisionName: "",
  cityName: "",
  postalZone: "",
  country: "",
};

export function CreateTaxpayerDialog() {
  const t = useTranslations("dashboard.taxpayers.create");
  const create = useCreateTaxpayer();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const isValid = Boolean(
    form.vat.trim() &&
      form.crn.trim() &&
      form.legalName.trim() &&
      form.streetName.trim() &&
      form.buildingNumber.trim() &&
      form.citySubdivisionName.trim() &&
      form.cityName.trim() &&
      form.postalZone.trim(),
  );

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(EMPTY);
      create.reset();
    }
  }

  function handleSubmit() {
    create.mutate(
      {
        vat: form.vat.trim(),
        crn: form.crn.trim(),
        legalName: form.legalName.trim(),
        address: {
          streetName: form.streetName.trim(),
          buildingNumber: form.buildingNumber.trim(),
          citySubdivisionName: form.citySubdivisionName.trim(),
          cityName: form.cityName.trim(),
          postalZone: form.postalZone.trim(),
          country: form.country.trim() || "SA",
        },
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
        <Button>
          <Plus />
          {t("trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {create.isError ? (
          <Alert variant="destructive">
            <AlertTitle>{t("errorTitle")}</AlertTitle>
            <AlertDescription>{t("error")}</AlertDescription>
          </Alert>
        ) : null}

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="tp-legal-name">{t("legalName")}</FieldLabel>
            <Input
              id="tp-legal-name"
              value={form.legalName}
              onChange={(e) => set("legalName", e.target.value)}
              autoComplete="organization"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="tp-vat">{t("vat")}</FieldLabel>
              <Input
                id="tp-vat"
                value={form.vat}
                onChange={(e) => set("vat", e.target.value)}
                placeholder="300000000000003"
                inputMode="numeric"
                dir="ltr"
              />
              <FieldDescription>{t("vatDescription")}</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="tp-crn">{t("crn")}</FieldLabel>
              <Input
                id="tp-crn"
                value={form.crn}
                onChange={(e) => set("crn", e.target.value)}
                placeholder="1010101010"
                inputMode="numeric"
                dir="ltr"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>{t("address")}</FieldLabel>
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                <Field>
                  <FieldLabel htmlFor="tp-street">{t("streetName")}</FieldLabel>
                  <Input
                    id="tp-street"
                    value={form.streetName}
                    onChange={(e) => set("streetName", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tp-building">
                    {t("buildingNumber")}
                  </FieldLabel>
                  <Input
                    id="tp-building"
                    value={form.buildingNumber}
                    onChange={(e) => set("buildingNumber", e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="tp-subdivision">
                    {t("citySubdivisionName")}
                  </FieldLabel>
                  <Input
                    id="tp-subdivision"
                    value={form.citySubdivisionName}
                    onChange={(e) => set("citySubdivisionName", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tp-city">{t("cityName")}</FieldLabel>
                  <Input
                    id="tp-city"
                    value={form.cityName}
                    onChange={(e) => set("cityName", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tp-postal">{t("postalZone")}</FieldLabel>
                  <Input
                    id="tp-postal"
                    value={form.postalZone}
                    onChange={(e) => set("postalZone", e.target.value)}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="tp-country">{t("country")}</FieldLabel>
                <Input
                  id="tp-country"
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  placeholder="SA"
                  dir="ltr"
                />
              </Field>
            </div>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={create.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || create.isPending}
          >
            {create.isPending ? t("creating") : t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
