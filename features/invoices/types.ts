export type InvoiceStatus =
  | "Pending"
  | "Reported"
  | "Rejected"
  | "Cleared"
  | "Failed";
export type InvoiceType =
  | "Standard"
  | "Simplified"
  | "StandardCreditNote"
  | "StandardDebitNote"
  | "SimplifiedCreditNote"
  | "SimplifiedDebitNote";
export interface Invoiceitems {
  icv: number;
  invoiceNumber: string;
  uuid: string;
  invoiceHash: string;
  invoiceType: InvoiceStatus;
  status: InvoiceStatus;
  createdAtUtc: string;
  reportedAtUtc: string;
  submissionAttempts: number;
}
