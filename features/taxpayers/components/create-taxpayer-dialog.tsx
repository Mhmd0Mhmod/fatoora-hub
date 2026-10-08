"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateTaxpayer } from "@/features/dashboard/hooks/use-taxpayers";
import {
  CreateTaxpayerInput,
  getCreateTaxpayerSchema,
} from "@/features/taxpayers/validators";
import { getApiErrorMessage } from "@/lib/api-error";

export function CreateTaxpayerDialog() {
  const t = useTranslations("dashboard.taxpayers.create");
  const create = useCreateTaxpayer();

  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<CreateTaxpayerInput>({
    resolver: zodResolver(getCreateTaxpayerSchema(t)),
    defaultValues: {
      legalName: "",
      vat: "",
      crn: "",
      streetName: "",
      buildingNumber: "",
      citySubdivisionName: "",
      cityName: "",
      postalZone: "",
      country: "",
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      create.reset();
    }
  }

  const onSubmit = handleSubmit((values) => {
    // Flat form state nests into the `address` shape the command expects.
    create.mutate(
      {
        vat: values.vat,
        crn: values.crn,
        legalName: values.legalName,
        address: {
          streetName: values.streetName,
          buildingNumber: values.buildingNumber,
          citySubdivisionName: values.citySubdivisionName,
          cityName: values.cityName,
          postalZone: values.postalZone,
          country: values.country || "SA",
        },
      },
      {
        onSuccess: () => {
          toast.success(t("success"));
          setOpen(false);
          reset();
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, t("error")));
        },
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">
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

        {/* `contents` keeps the field group + footer as the dialog's grid children. */}
        <form onSubmit={onSubmit} noValidate className="contents">
          <FieldGroup>
            <Controller
              name="legalName"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="tp-legal-name">
                    {t("legalName")}
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="tp-legal-name"
                      autoComplete="organization"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </FieldContent>
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="vat"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="tp-vat">{t("vat")}</FieldLabel>
                    <FieldContent>
                      <Input
                        id="tp-vat"
                        placeholder="300000000000003"
                        inputMode="numeric"
                        dir="ltr"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </FieldContent>
                    <FieldDescription>{t("vatDescription")}</FieldDescription>
                  </Field>
                )}
              />

              <Controller
                name="crn"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="tp-crn">{t("crn")}</FieldLabel>
                    <FieldContent>
                      <Input
                        id="tp-crn"
                        placeholder="1010101010"
                        inputMode="numeric"
                        dir="ltr"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            <Field>
              <FieldLabel>{t("address")}</FieldLabel>
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                  <Controller
                    name="streetName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="tp-street">
                          {t("streetName")}
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id="tp-street"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          <FieldError>
                            {fieldState.error?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Controller
                    name="buildingNumber"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="tp-building">
                          {t("buildingNumber")}
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id="tp-building"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          <FieldError>
                            {fieldState.error?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Controller
                    name="citySubdivisionName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="tp-subdivision">
                          {t("citySubdivisionName")}
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id="tp-subdivision"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          <FieldError>
                            {fieldState.error?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Controller
                    name="cityName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="tp-city">
                          {t("cityName")}
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id="tp-city"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          <FieldError>
                            {fieldState.error?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Controller
                    name="postalZone"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="tp-postal">
                          {t("postalZone")}
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id="tp-postal"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          <FieldError>
                            {fieldState.error?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="country"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="tp-country">
                        {t("country")}
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="tp-country"
                          placeholder="SA"
                          dir="ltr"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={create.isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? t("creating") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
