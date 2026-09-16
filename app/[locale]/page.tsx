import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Developers from "@/features/landing/components/Developers";
import FAQ from "@/features/landing/components/FAQ";
import Features from "@/features/landing/components/Features";
import Footer from "@/features/landing/components/Footer";
import Header from "@/features/landing/components/Header";
import Hero from "@/features/landing/components/Hero";
import Pricing from "@/features/landing/components/Pricing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("meta");

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "x-default": "/en",
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale,
      siteName: "Fatoora Hub",
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Developers />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}