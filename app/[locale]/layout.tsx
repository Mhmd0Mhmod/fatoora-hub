import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { Cairo, JetBrains_Mono, Tenor_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { DirectionProvider } from "@/components/ui/direction";

const fontSans = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-sans",
});

const fontSerif = Tenor_Sans({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <DirectionProvider dir={direction} direction={direction}>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </DirectionProvider>
        <Toaster />
      </body>
    </html>
  );
}
