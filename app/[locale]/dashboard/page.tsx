import { getTranslations } from "next-intl/server";
import { FileText, Monitor, Users, IdCard } from "lucide-react";

import { DashboardPage } from "@/components/layouts/dashboard-page";
import {
  DashboardStat,
  DashboardStatGrid,
} from "@/components/layouts/dashboard-stat";

const stats = [
  { key: "invoices", icon: FileText },
  { key: "clients", icon: Users },
  { key: "devices", icon: Monitor },
  { key: "taxpayers", icon: IdCard },
] as const;

export default async function DashboardOverviewPage() {
  const t = await getTranslations("dashboard");
  const statT = await getTranslations("dashboard.stats");

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")}>
      <DashboardStatGrid>
        {stats.map(({ key, icon: Icon }) => (
          <DashboardStat
            key={key}
            label={statT(key)}
            value="0"
            icon={<Icon className="size-5" />}
          />
        ))}
      </DashboardStatGrid>
    </DashboardPage>
  );
}