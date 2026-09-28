import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { nextApi } from "@/lib/next-api";

import { Device } from "../../devices/types";
import {
  DeviceInvoicingType,
  DevicePhaseType,
  RegisterDeviceCommand,
  RegisterDeviceResponse,
  RenewCertificateResponse,
  ZatcaEnvironment,
} from "../types";

export interface GetDevicesParams {
  searchTerm?: string;
  environment?: ZatcaEnvironment;
  invoicingType?: DeviceInvoicingType;
  phase?: DevicePhaseType;
}

export function useDevices(taxpayerId: string, params: GetDevicesParams) {
  const query = useQuery({
    queryKey: ["dashboard", "taxpayers", taxpayerId, "devices", params],
    queryFn: async () => {
      const { data } = await nextApi.get<Device[]>(
        `/taxpayers/${taxpayerId}/devices`,
        {
          params,
        },
      );
      return data;
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(taxpayerId),
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

export function useRegisterDevice(taxpayerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RegisterDeviceCommand) => {
      const { data } = await nextApi.post<RegisterDeviceResponse>(
        `/taxpayers/${taxpayerId}/devices`,
        input,
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["dashboard", "taxpayers", taxpayerId, "devices"],
      });
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useRenewCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { deviceId: string; otp?: string }) => {
      const { data } = await nextApi.post<RenewCertificateResponse>(
        `/devices/${input.deviceId}/renew-cert`,
        input.otp ? { otp: input.otp } : {},
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["dashboard", "devices", variables.deviceId, "health"],
      });
    },
  });
}
