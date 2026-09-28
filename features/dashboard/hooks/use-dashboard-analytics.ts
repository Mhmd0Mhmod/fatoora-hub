import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { nextApi } from "@/lib/next-api";

import { DashboardAnalyticsResponse } from "../types";

export interface GetAnalyticsParams {
  days?: number;
  fromDate?: string;
  toDate?: string;
  deviceId?: string;
  taxpayerId?: string;
}

export function useDashboardAnalytics(params: GetAnalyticsParams) {
  const query = useQuery({
    queryKey: ["dashboard", "analytics", params],
    queryFn: async () => {
      const { data } = await nextApi.get<DashboardAnalyticsResponse>(
        "/dashboard/analytics",
        { params },
      );
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
