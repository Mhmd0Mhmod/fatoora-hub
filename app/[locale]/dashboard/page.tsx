import { getTranslations } from "next-intl/server";

import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { DashboardPage } from "@/features/dashboard/components/dashboard-page";

export default async function DashboardOverviewPage() {
  const t = await getTranslations("dashboard");

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")}>
      <DashboardOverview />
    </DashboardPage>
  );
}
