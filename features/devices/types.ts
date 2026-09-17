import { InvoiceType } from "../invoices/types";

export interface Device {
  deviceId: string;
  name: string;
  egsSerialNumber: string;
  currentPhase: string;
  environment: string;
  invoicingType: InvoiceType;
  currentIcv: number;
  previousInvoiceHash: string;
  certIssuedAtUtc: string | null;
  certExpiresAtUtc: string | null;
  daysUntilExpiry: string | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
}
