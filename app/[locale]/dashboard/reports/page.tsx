import { getTranslations } from "next-intl/server";

import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import { ReportsView } from "@/features/dashboard/components/reports-view";

export default async function ReportsPage() {
  const t = await getTranslations("dashboard.pages.reports");

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")}>
      <ReportsView />
    </DashboardPage>
  );
}
