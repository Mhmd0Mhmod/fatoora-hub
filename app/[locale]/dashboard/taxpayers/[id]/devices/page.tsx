import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import DevicesView, {
  DevicesGridSkeleton,
} from "@/features/devices/components/devices-view";

type TaxpayerDevicesParams = Promise<{ locale: string; id: string }>;

export default async function TaxpayerDevicesPage({
  params,
}: {
  params: TaxpayerDevicesParams;
}) {
  const t = await getTranslations("dashboard.pages.taxpayers.view");

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")}>
      <Suspense fallback={<DevicesGridSkeleton />}>
        <TaxpayerDevices params={params} />
      </Suspense>
    </DashboardPage>
  );
}

async function TaxpayerDevices({ params }: { params: TaxpayerDevicesParams }) {
  const { id } = await params;

  return <DevicesView taxpayerId={id} />;
}
