"use client";

import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginAction } from "../actions";
import { getLoginSchema, LoginInput } from "../vaildators";

export default function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const { handleSubmit, control } = useForm<LoginInput>({
    resolver: zodResolver(getLoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutate: login, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginAction,
    onSuccess: (data, _, __, ctx) => {
      toast.success(t("success"));
      router.replace("/dashboard");
      ctx.client.setQueryData(["me"], data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = handleSubmit((values) => {
    login(values);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={t("passwordPlaceholder")}
                    aria-invalid={fieldState.invalid}
                    className="pe-9"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={
                      showPassword ? t("hidePassword") : t("showPassword")
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-e-1 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
                <FieldError>{fieldState.error?.message}</FieldError>
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex items-center justify-between gap-4">
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <Label
              htmlFor="rememberMe"
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Checkbox
                id="rememberMe"
                checked={field.value ?? false}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              {t("rememberMe")}
            </Label>
          )}
        />
        <a
          href="#"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("forgotPassword")}
        </a>
      </div>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
