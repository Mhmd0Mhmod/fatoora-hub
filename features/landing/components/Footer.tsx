import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Logo from "@/app/icon.png";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

type FooterLink = {
  label: string;
  href: string;
};

export default async function Footer() {
  const t = await getTranslations("footer");
  const links = t.raw("links") as FooterLink[];

  return (
    <footer className="bg-[#07251f] py-16 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#hero" className="flex items-center gap-2.5">
              <Image
                src={Logo}
                alt={t("brand")}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
              <span className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold tracking-tight">
                  {t("brand")}
                </span>
                <span className="text-sm font-semibold text-white/60">
                  {t("brandSub")}
                </span>
              </span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
              {t("brandDesc")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">{t("linksTitle")}</h4>

            <nav className="flex flex-col gap-3 text-sm text-white/60">
              {links.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact / CTA */}
          <div>
            <h4 className="mb-4 font-semibold">{t("helpTitle")}</h4>

            <p className="text-sm leading-7 text-white/60">{t("helpDesc")}</p>

            <a
              href="#faq"
              className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-300 transition-colors hover:text-teal-200"
            >
              {t("contact")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="text-center text-sm text-white/50">{t("rights")}</div>
      </div>
    </footer>
  );
}
