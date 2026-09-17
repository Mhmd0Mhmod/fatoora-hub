import { getTranslations } from "next-intl/server";
import { KeyRound } from "lucide-react";

import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function ApiKeysPage() {
  const t = await getTranslations("dashboard.pages.apiKeys");
  const empty = await getTranslations("dashboard.empty");

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")}>
      <DashboardSection>
        <Empty>
          <EmptyMedia variant="icon">
            <KeyRound />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>{empty("title")}</EmptyTitle>
            <EmptyDescription>{empty("description")}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </DashboardSection>
    </DashboardPage>
  );
}
