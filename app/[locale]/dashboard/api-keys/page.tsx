import { getTranslations } from "next-intl/server";

import { ApiKeysView } from "@/features/api-keys/components/api-keys-view";
import { DashboardPage } from "@/features/dashboard/components/dashboard-page";

export default async function ApiKeysPage() {
  const t = await getTranslations("dashboard.pages.apiKeys");

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")}>
      <ApiKeysView />
    </DashboardPage>
  );
}
