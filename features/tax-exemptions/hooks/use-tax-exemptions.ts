import { useQuery } from "@tanstack/react-query";

import { nextApi } from "@/lib/next-api";

import { TaxExemptionCategory } from "../types";

export function useTaxExemptions(category?: string) {
  return useQuery({
    queryKey: ["tax-exemptions", category ?? "all"],
    queryFn: async () => {
      const { data } = await nextApi.get<TaxExemptionCategory[]>(
        category ? `/tax-exemptions/${category}` : "/tax-exemptions",
      );
      // The single-category endpoint returns one object, not an array.
      return Array.isArray(data) ? data : [data];
    },
    retry: false,
  });
}
