import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { nextApi } from "@/lib/next-api";

import { CreateTaxpayerCommand, TaxpayerResponse } from "../types";

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

export function useCreateTaxpayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTaxpayerCommand) => {
      await nextApi.post("/taxpayers", input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "taxpayers"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
