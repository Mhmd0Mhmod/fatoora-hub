import { Address } from "@/types/address";

export interface Taxpayer {
  id: string;
  legalName: string;
  vat: string;
  crn: string;
  isVatGroup: boolean;
  logoUrl: string;
  address: Address;
  devicesCount: number;
}
