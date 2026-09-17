import { getTranslations } from "next-intl/server";

import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import InvoicesView from "@/features/dashboard/components/invoices-view";

export default async function InvoicesPage() {
  const t = await getTranslations("dashboard.pages.invoices");

  return (
    <DashboardPageLayout title={t("title")} subtitle={t("subtitle")}>
      <InvoicesView />
    </DashboardPageLayout>
  );
}
