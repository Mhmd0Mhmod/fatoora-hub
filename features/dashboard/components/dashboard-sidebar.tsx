"use client";

import LogoImage from "@/components/shared/logo-image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import {
  BarChart3,
  Building2,
  FileText,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Settings,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const mainItems = [
  { key: "overview", href: "/dashboard", icon: LayoutDashboard },
  { key: "invoices", href: "/dashboard/invoices", icon: FileText },
  { key: "taxpayers", href: "/dashboard/taxpayers", icon: Building2 },
  { key: "apiKeys", href: "/dashboard/api-keys", icon: KeyRound },
  { key: "reports", href: "/dashboard/reports", icon: BarChart3 },
] as const;

const accountItems = [
  { key: "settings", href: "/dashboard/settings", icon: Settings },
  { key: "support", href: "/dashboard/support", icon: LifeBuoy },
] as const;

export default function DashboardSidebar() {
  const t = useTranslations("dashboard.sidebar");
  const header = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Sidebar
      side={locale === "ar" ? "right" : "left"}
      collapsible="icon"
      variant="inset"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-2.5 relative">
                <LogoImage />
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {header("brand")}
                  </span>
                  <span className="text-xs text-sidebar-foreground/60">
                    {header("brandSub")}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("main")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={t(item.key)}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{t(item.key)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("account")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={t(item.key)}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{t(item.key)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
