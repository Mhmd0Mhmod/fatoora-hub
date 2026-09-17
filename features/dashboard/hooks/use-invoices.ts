import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { nextApi } from "@/lib/next-api";

import {
  GetInvoicesParams,
  PagedResponseOfInvoiceListItemResponse,
} from "../types";

export function useInvoices(params: GetInvoicesParams) {
  const query = useQuery({
    queryKey: ["dashboard", "invoices", params],
    queryFn: async () => {
      const { data } =
        await nextApi.get<PagedResponseOfInvoiceListItemResponse>("/invoices", {
          params,
        });
      return data;
    },
    placeholderData: keepPreviousData,
    retry: false,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}
