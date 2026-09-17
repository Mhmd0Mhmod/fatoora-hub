export type InvoiceStatus =
  "Pending" | "Reported" | "Rejected" | "Cleared" | "Failed";
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
  createdAtUtc: "2024-12-02T14:30:00Z";
  reportedAtUtc: "2024-12-02T14:30:05Z";
  submissionAttempts: 1;
}
