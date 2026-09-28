import { useQuery } from "@tanstack/react-query";

import { nextApi } from "@/lib/next-api";

import { DeviceHealth } from "../../devices/types";

export function useDeviceHealth(deviceId: string) {
  return useQuery({
    queryKey: ["dashboard", "devices", deviceId, "health"],
    queryFn: async () => {
      const { data } = await nextApi.get<DeviceHealth>(`/devices/${deviceId}/health`);
      return data;
    },
    enabled: Boolean(deviceId),
    retry: false,
  });
}
