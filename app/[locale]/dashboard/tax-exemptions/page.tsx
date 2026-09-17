import { getTranslations } from "next-intl/server";
import { ShieldCheck } from "lucide-react";

import { DashboardPage } from "@/components/layouts/dashboard-page";
import { DashboardSection } from "@/components/layouts/dashboard-section";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function TaxExemptionsPage() {
  const t = await getTranslations("dashboard.pages.taxExemptions");
  const empty = await getTranslations("dashboard.empty");

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")}>
      <DashboardSection>
        <Empty>
          <EmptyMedia variant="icon">
            <ShieldCheck />
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