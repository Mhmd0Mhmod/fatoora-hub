import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { nextApi } from "@/lib/next-api";

import { APIKey, ApiKeyCreated } from "../types";

export function useApiKeys(deviceId?: string) {
  return useQuery({
    queryKey: ["api-keys", deviceId ?? "all"],
    queryFn: async () => {
      const { data } = await nextApi.get<APIKey[]>("/api-keys", {
        params: deviceId ? { deviceId } : undefined,
      });
      return data;
    },
    retry: false,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["api-keys", "create"],
    mutationFn: async (input: { deviceId: string; expiresInDays?: number | null }) => {
      const { data } = await nextApi.post<ApiKeyCreated>("/api-keys", {
        deviceId: input.deviceId,
        ...(input.expiresInDays ? { expiresInDays: input.expiresInDays } : {}),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["api-keys", "revoke"],
    mutationFn: async (id: string) => {
      await nextApi.delete(`/api-keys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}
