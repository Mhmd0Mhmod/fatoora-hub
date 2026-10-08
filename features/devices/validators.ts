import * as z from "zod";

import {
  DeviceInvoicingType,
  ZatcaEnvironment,
} from "@/features/dashboard/types";

type Translate = (key: string) => string;

/**
 * Single source for the two dropdowns: feeds both `z.enum` (validation) and the
 * `<Select>` options, so the form cannot offer a value the API would reject.
 */
export const INVOICING_TYPES = [
  "Standard",
  "Simplified",
  "Both",
] as const satisfies readonly DeviceInvoicingType[];

export const ENVIRONMENTS = [
  "Simulation",
  "Production",
] as const satisfies readonly ZatcaEnvironment[];

export function getRegisterDeviceSchema(t: Translate) {
  const required = z
    .string()
    .trim()
    .min(1, { message: t("errors.required") });

  return z.object({
    otp: required,
    commonName: required,
    location: required,
    industry: required,
    organizationUnitName: required,
    invoiceType: z.enum(INVOICING_TYPES),
    environment: z.enum(ENVIRONMENTS),
  });
}

/** Field names line up with `RegisterDeviceCommand`, so values post directly. */
export type RegisterDeviceInput = z.infer<
  ReturnType<typeof getRegisterDeviceSchema>
>;
