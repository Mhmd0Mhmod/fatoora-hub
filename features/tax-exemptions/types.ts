export interface TaxExemptionCode {
  code: string;
  categoryId: string;
  englishReason: string;
  arabicReason: string;
  formattedReason: string;
}

export interface TaxExemptionCategory {
  categoryId: string;
  description: string;
  codes: TaxExemptionCode[];
}
