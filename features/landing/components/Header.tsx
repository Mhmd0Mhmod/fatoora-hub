"use client";

import { Globe, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";

const navItems = ["home", "features", "developers", "pricing", "faq"] as const;

export default function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky  top-0 z-10 border-b border-border/60 bg-white  backdrop-blur-xl supports-backdrop-filter:bg-white/50 dark:bg-neutral-950/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-400 to-cyan-600 text-white shadow-md shadow-teal-500/20">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold tracking-tight">
              {t("brand")}
            </span>
            <span className="hidden text-sm font-semibold text-muted-foreground sm:inline">
              {t("brandSub")}
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(`nav.${item}`)}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/"
            locale={otherLocale}
            aria-label={t("switchLabel")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            {t("switchTo")}
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">{t("signup")}</Link>
          </Button>
        </div>

        {/* Mobile trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "close" : t("menu")}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border/60 bg-background/95 px-6 pb-6 pt-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(`nav.${item}`)}
              </a>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                locale={otherLocale}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
              >
                <Globe className="h-4 w-4" />
                {t("switchTo")}
              </Link>
            </div>
            <Button variant="outline" asChild>
              <Link href="/login">{t("login")}</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">{t("signup")}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
