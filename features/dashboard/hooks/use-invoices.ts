import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { nextApi } from "@/lib/next-api";

import {
  GetInvoicesParams,
  InvoiceDetailsResponse,
  InvoiceMetadataResponse,
  PagedResponseOfInvoiceListItemResponse,
  RequeueFailedInvoicesResponse,
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

export function useInvoiceDetails(invoiceNumber: string | null) {
  const query = useQuery({
    queryKey: ["dashboard", "invoices", "detail", invoiceNumber],
    queryFn: async () => {
      const { data } = await nextApi.get<InvoiceDetailsResponse>(
        `/invoices/${invoiceNumber}`,
      );
      return data;
    },
    enabled: Boolean(invoiceNumber),
    retry: false,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useRetryInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceNumber: string) => {
      const { data } = await nextApi.post<InvoiceMetadataResponse>(
        `/invoices/${invoiceNumber}/retry`,
      );
      return data;
    },
    onSuccess: (_data, invoiceNumber) => {
      void queryClient.invalidateQueries({
        queryKey: ["dashboard", "invoices"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["dashboard", "invoices", "detail", invoiceNumber],
      });
    },
  });
}

export function useRetryFailedInvoices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceNumbers: string[]) => {
      const { data } = await nextApi.post<RequeueFailedInvoicesResponse>(
        "/invoices/retry-failed",
        { invoiceNumbers },
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["dashboard", "invoices"],
      });
    },
  });
}

/** Streams the PDF through the proxy and saves it as `<invoiceNumber>.pdf`. */
export async function downloadInvoicePdf(invoiceNumber: string) {
  const { data } = await nextApi.get<Blob>(`/invoices/${invoiceNumber}/pdf`, {
    responseType: "blob",
  });

  const url = URL.createObjectURL(data);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${invoiceNumber}.pdf`;
  link.click();

  URL.revokeObjectURL(url);
}
