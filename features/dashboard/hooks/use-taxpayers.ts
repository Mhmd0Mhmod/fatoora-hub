import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { nextApi } from "@/lib/next-api";

import { TaxpayerResponse } from "../types";

export function useTaxpayers(searchTerm: string) {
  const trimmed = searchTerm.trim();

  const query = useQuery({
    queryKey: ["dashboard", "taxpayers", trimmed],
    queryFn: async () => {
      const { data } = await nextApi.get<TaxpayerResponse[]>("/taxpayers", {
        params: trimmed ? { searchTerm: trimmed } : undefined,
      });
      return data;
    },
    placeholderData: keepPreviousData,
    retry: false,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}
