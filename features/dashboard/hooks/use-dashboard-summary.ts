import { useQuery } from "@tanstack/react-query";

import { nextApi } from "@/lib/next-api";

import {
  DashboardActivityResponse,
  DashboardSummaryResponse,
} from "../types";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const { data } = await nextApi.get<DashboardSummaryResponse>(
        "/dashboard/summary",
      );
      return data;
    },
    retry: false,
  });
}

export function useDashboardActivity(limit = 10) {
  return useQuery({
    queryKey: ["dashboard", "activity", limit],
    queryFn: async () => {
      const { data } = await nextApi.get<DashboardActivityResponse>(
        "/dashboard/activity",
        { params: { limit } },
      );
      return data.items;
    },
    retry: false,
  });
}
