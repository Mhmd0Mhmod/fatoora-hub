import * as z from "zod";

type Translate = (key: string) => string;

export function getCreateTaxpayerSchema(t: Translate) {
  const required = z
    .string()
    .trim()
    .min(1, { message: t("errors.required") });

  return z.object({
    legalName: required,
    vat: required,
    crn: required,
    streetName: required,
    buildingNumber: required,
    citySubdivisionName: required,
    cityName: required,
    postalZone: required,
    /** Optional — the API defaults it, and we submit "SA" when left blank. */
    country: z.string().trim(),
  });
}

/**
 * Kept flat to match the field ids; `onSubmit` nests these into the
 * `address: AddressDto` shape `CreateTaxpayerCommand` expects.
 */
export type CreateTaxpayerInput = z.infer<
  ReturnType<typeof getCreateTaxpayerSchema>
>;
