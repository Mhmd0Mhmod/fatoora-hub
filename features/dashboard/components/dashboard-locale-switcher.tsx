"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";

export default function DashboardLocaleSwitcher() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href={pathname} locale={otherLocale} aria-label={t("switchLabel")}>
        <Globe className="size-4" />
        {t("switchTo")}
      </Link>
    </Button>
  );
}
