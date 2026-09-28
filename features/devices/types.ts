import {
  DeviceInvoicingType,
  DevicePhaseType,
  ZatcaEnvironment,
} from "../dashboard/types";

export interface DeviceHealth {
  deviceId: string;
  name: string;
  egsSerialNumber: string;
  currentPhase: DevicePhaseType;
  environment: ZatcaEnvironment;
  invoicingType: DeviceInvoicingType;
  currentIcv: number;
  previousInvoiceHash: string;
  certIssuedAtUtc: string | null;
  certExpiresAtUtc: string | null;
  daysUntilExpiry: number | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export interface Device {
  id: string;
  name: string;
  egsSerialNumber: string;
  invoicingType: DeviceInvoicingType;
  currentPhase: DevicePhaseType;
  environment: ZatcaEnvironment;
  createdAtUtc: string;
}
