import { getTranslations } from "next-intl/server";

import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import { TaxExemptionsView } from "@/features/tax-exemptions/components/tax-exemptions-view";

export default async function TaxExemptionsPage() {
  const t = await getTranslations("dashboard.pages.taxExemptions");

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")}>
      <TaxExemptionsView />
    </DashboardPage>
  );
}
