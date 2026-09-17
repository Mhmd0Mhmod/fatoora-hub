import { getTranslations } from "next-intl/server";

import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import TaxpayersView from "@/features/dashboard/components/taxpayers-view";

export default async function TaxpayersPage() {
  const t = await getTranslations("dashboard.pages.taxpayers");

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")}>
      <TaxpayersView />
    </DashboardPage>
  );
}