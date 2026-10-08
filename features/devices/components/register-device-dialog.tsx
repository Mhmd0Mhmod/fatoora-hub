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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterDevice } from "@/features/dashboard/hooks/use-devices";
import {
  ENVIRONMENTS,
  getRegisterDeviceSchema,
  INVOICING_TYPES,
  type RegisterDeviceInput,
} from "@/features/devices/validators";
import { getApiErrorMessage } from "@/lib/api-error";

export function RegisterDeviceDialog({ taxpayerId }: { taxpayerId: string }) {
  const t = useTranslations("dashboard.devices.register");
  const register = useRegisterDevice(taxpayerId);

  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<RegisterDeviceInput>({
    resolver: zodResolver(getRegisterDeviceSchema(t)),
    defaultValues: {
      otp: "",
      commonName: "",
      location: "",
      industry: "",
      organizationUnitName: "",
      invoiceType: "Standard",
      environment: "Simulation",
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      register.reset();
    }
  }

  const onSubmit = handleSubmit((values) => {
    // Field names match `RegisterDeviceCommand` one for one, so this posts as-is.
    register.mutate(values, {
      onSuccess: () => {
        toast.success(t("success"));
        setOpen(false);
        reset();
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, t("error")));
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="sm:ms-auto">
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

        {/* `contents` keeps the field group + footer as the dialog's grid children. */}
        <form onSubmit={onSubmit} noValidate className="contents">
          <FieldGroup>
            <Controller
              name="otp"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="device-otp">{t("otp")}</FieldLabel>
                  <FieldContent>
                    <Input
                      id="device-otp"
                      dir="ltr"
                      autoComplete="one-time-code"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </FieldContent>
                  <FieldDescription>{t("otpDescription")}</FieldDescription>
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="commonName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="device-common-name">
                      {t("commonName")}
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="device-common-name"
                        placeholder="T1-EGS-01"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="organizationUnitName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="device-organization">
                      {t("organizationUnitName")}
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="device-organization"
                        placeholder="300000000000003"
                        inputMode="numeric"
                        dir="ltr"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </FieldContent>
                    <FieldDescription>
                      {t("organizationUnitNameDescription")}
                    </FieldDescription>
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="location"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="device-location">
                      {t("location")}
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="device-location"
                        placeholder="Riyadh"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="industry"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="device-industry">
                      {t("industry")}
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="device-industry"
                        placeholder="Retail"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="invoiceType"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{t("invoicingType.title")}</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="start">
                        {INVOICING_TYPES.map((value) => (
                          <SelectItem key={value} value={value}>
                            {t(`invoicingType.${value}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                name="environment"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{t("environment.title")}</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="start">
                        {ENVIRONMENTS.map((value) => (
                          <SelectItem key={value} value={value}>
                            {t(`environment.${value}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={register.isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={register.isPending}>
              {register.isPending ? t("registering") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
