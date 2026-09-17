import * as z from "zod";
export function getLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t("errors.emailRequired") })
      .email({ message: t("errors.invalidEmail") }),
    password: z.string().min(6, { message: t("errors.passwordMin") }),
    rememberMe: z.boolean().optional(),
  });
}
export type LoginInput = z.infer<ReturnType<typeof getLoginSchema>>;
