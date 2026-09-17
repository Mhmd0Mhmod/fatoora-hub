export type Ulid = string;

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

export type InvoiceDocumentType = "Invoice" | "DebitNote" | "CreditNote";

export type DeviceInvoicingType = "Standard" | "Simplified" | "Both";

export type DevicePhaseType = "Compliance" | "Production";

export type ZatcaEnvironment = "Simulation" | "Production";

export type WalletStatus = "Active" | "PastDue" | "Suspended";

export type ApiKeyStatus = "Active" | "Suspended";

export interface AddressDto {
  streetName: string;
  buildingNumber: string;
  citySubdivisionName: string;
  cityName: string;
  postalZone: string;
  /** Defaults to "SA". */
  country?: string;
}

export interface AddressResponse {
  streetName: string;
  buildingNumber: string;
  citySubdivisionName: string;
  cityName: string;
  postalZone: string;
  country: string;
}

export interface AllowanceChargeDto {
  amount: number;
  isCharge?: boolean;
  reasonCode?: string | null;
  reason?: string | null;
  /** Defaults to "S". */
  taxCategory?: string;
  /** Defaults to 15. */
  taxRate?: number;
  taxExemptionReasonCode?: string | null;
  taxExemptionReason?: string | null;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  field?: string | null;
  meta?: Record<string, unknown> | null;
}

export interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  detail?: string | null;
  traceId?: string | null;
  errors: ApiErrorDetail[];
}

export interface LoginCommand {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  role: string | null;
  clientId: Ulid | null;
}

export interface CreateApiKeyCommand {
  deviceId: Ulid;
  /** Null = no expiry. */
  expiresInDays?: number | null;
}

export interface ApiKeyCreatedResponse {
  id: string;
  clearTextApiKey: string;
  prefix: string;
  deviceName: string;
  deviceId: string;
  taxpayerName: string;
  environment: ZatcaEnvironment;
  createdAtUtc: string;
  expiresAtUtc: string;
}

export interface ApiKeyListItemResponse {
  id: string;
  prefix: string;
  deviceName: string;
  deviceId: string;
  taxpayerName: string;
  environment: ZatcaEnvironment;
  status: ApiKeyStatus;
  createdAtUtc: string;
  lastUsedAtUtc?: string | null;
  expiresAtUtc: string;
}

export interface CustomerDto {
  vat: string;
  legalName: string;
  streetName: string;
  buildingNumber: string;
  citySubdivisionName: string;
  cityName: string;
  postalZone: string;
  countryCode?: string;
}

export interface SimpleCustomerDto {
  legalName?: string | null;
  streetName?: string | null;
  buildingNumber?: string | null;
  citySubdivisionName?: string | null;
  cityName?: string | null;
  postalZone?: string | null;
  countryCode?: string | null;
  vat?: string | null;
  registrationNumber?: string | null;
}

export interface DailyInvoiceMetricResponse {
  date: string;
  total: number;
  cleared: number;
  reported: number;
  rejected: number;
}

export interface DashboardAnalyticsResponse {
  fromDateUtc: string;
  toDateUtc: string;
  totalInvoices: number;
  dailyMetrics: DailyInvoiceMetricResponse[];
}

export interface DashboardActionItemsResponse {
  rejectedCount: number;
  failedCount: number;
  pendingApproachingSlaCount: number;
  devicesExpiringSoonCount: number;
}

export interface DashboardActivityItemResponse {
  invoiceNumber: string;
  uuid: string;
  invoiceType: InvoiceType;
  status: InvoiceStatus;
  createdAtUtc: string;
  deviceName: string;
  taxpayerName: string;
  lastError?: string | null;
}

export interface DashboardActivityResponse {
  items: DashboardActivityItemResponse[];
}

export interface WalletSummaryResponse {
  planName: string;
  monthlyQuota: number;
  monthlyAvailable: number;
  topUpAvailable: number;
  walletStatus: WalletStatus;
  currentCycleEndDateUtc: string;
}

export interface InvoiceStatusCountsResponse {
  total: number;
  cleared: number;
  reported: number;
  pending: number;
  rejected: number;
  failed: number;
}

export interface DashboardSummaryResponse {
  wallet: WalletSummaryResponse;
  invoicingToday: InvoiceStatusCountsResponse;
  invoicingCurrentCycle: InvoiceStatusCountsResponse;
  passRatePercentage: number;
  taxpayersCount: number;
  devicesCount: number;
  actionItems: DashboardActionItemsResponse;
}

export interface RegisterDeviceCommand {
  otp: string;
  commonName: string;
  location: string;
  industry: string;
  invoiceType?: DeviceInvoicingType;
  environment?: ZatcaEnvironment;
  organizationUnitName: string;
}

export interface CreateTaxpayerCommand {
  vat: string;
  crn: string;
  legalName: string;
  address: AddressDto;
  logoBase64?: string | null;
}

export interface TaxpayerResponse {
  id: string;
  legalName: string;
  vat: string;
  crn: string;
  isVatGroup: boolean;
  logoUrl?: string | null;
  address: AddressResponse;
  devicesCount: number;
}

export interface TaxExemptionCodeResponse {
  code: string;
  categoryId: string;
  englishReason: string;
  arabicReason: string;
  formattedReason: string;
}

export interface TaxExemptionCategoryResponse {
  categoryId: string;
  description: string;
  codes: TaxExemptionCodeResponse[];
}

export interface DeviceResponse {
  id: string;
  name: string;
  egsSerialNumber: string;
  invoicingType: DeviceInvoicingType;
  currentPhase: DevicePhaseType;
  environment: ZatcaEnvironment;
  createdAtUtc: string;
}

export type RegisterDeviceResponse = DeviceResponse;

export interface DeviceHealthResponse {
  deviceId: string;
  name: string;
  egsSerialNumber: string;
  currentPhase: DevicePhaseType;
  environment: ZatcaEnvironment;
  invoicingType: DeviceInvoicingType;
  currentIcv: number;
  previousInvoiceHash: string;
  certIssuedAtUtc?: string | null;
  certExpiresAtUtc?: string | null;
  daysUntilExpiry?: number | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export interface RenewDeviceCertificateCommand {
  otp?: string;
}

export interface RenewCertificateResponse {
  deviceId: string;
  certIssuedAtUtc: string;
  certExpiresAtUtc: string;
  daysUntilExpiry: number;
  message: string;
}

export interface InvoiceLineDto {
  id?: number | null;
  quantity?: number;
  unitPrice?: number;
  itemName?: string;
  discountAmount?: number | null;
  /** Defaults to "S". */
  taxCategory?: string;
  /** Defaults to 15. */
  taxRate?: number;
  taxExemptionReasonCode?: string | null;
  taxExemptionReason?: string | null;
}

export interface InvoiceListItemResponse {
  invoiceNumber: string;
  uuid: string;
  icv: number;
  invoiceHash: string;
  invoiceType: InvoiceType;
  status: InvoiceStatus;
  createdAtUtc: string;
  reportedAtUtc?: string | null;
  clearedAtUtc?: string | null;
  rejectedAtUtc?: string | null;
  failedAtUtc?: string | null;
  lastRetryAtUtc?: string | null;
  submissionAttempts?: number;
  lastError?: string | null;
}

export interface PagedResponseOfInvoiceListItemResponse {
  items: InvoiceListItemResponse[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface InvoiceDetailsResponse {
  invoiceNumber: string;
  uuid: string;
  icv: number;
  invoiceType: InvoiceType;
  invoiceHash: string;
  status: InvoiceStatus;
  createdAtUtc: string;
  base64SignedInvoice?: string | null;
  base64QrCode?: string | null;
  qrCodeImage?: string | null;
  reportedAtUtc?: string | null;
  clearedAtUtc?: string | null;
  rejectedAtUtc?: string | null;
  failedAtUtc?: string | null;
  lastRetryAtUtc?: string | null;
  submissionAttempts?: number;
  lastError?: string | null;
}

export interface InvoiceMetadataResponse {
  invoiceNumber: string;
  uuid: string;
  icv: number;
  invoiceHash: string;
  status?: InvoiceStatus;
  qrCode?: string | null;
  invoiceType?: InvoiceType | null;
  submittedAtUtc?: string | null;
  warnings?: string[] | null;
}

export interface SimpleInvoiceCommand {
  invoiceNumber: string;
  paymentMeansCode: string;
  lines: InvoiceLineDto[];
  issueDateTime?: string | null;
  note?: string | null;
  paymentInstructionNote?: string | null;
  originalInvoiceNumber?: string | null;
  invoiceType?: InvoiceDocumentType;
  allowanceCharges?: AllowanceChargeDto[] | null;
  customer?: SimpleCustomerDto | null;
}

export interface StandardInvoiceCommand {
  invoiceNumber: string;
  paymentMeansCode: string;
  customer: CustomerDto;
  actualDeliveryDate: string;
  lines: InvoiceLineDto[];
  issueDateTime?: string | null;
  note?: string | null;
  paymentInstructionNote?: string | null;
  originalInvoiceNumber?: string | null;
  invoiceType?: InvoiceDocumentType;
  allowanceCharges?: AllowanceChargeDto[] | null;
  latestDeliveryDate?: string | null;
}

export interface RequeueFailedInvoicesCommand {
  invoiceNumbers: string[];
}

export interface RequeueFailedInvoicesResponse {
  requeuedCount: number;
  message: string;
}

export interface GetInvoicesParams {
  pageNumber?: number;
  pageSize?: number;
  status?: InvoiceStatus;
  invoiceType?: InvoiceType;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  deviceId?: string;
  taxpayerId?: string;
}