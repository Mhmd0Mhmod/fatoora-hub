import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import LoginForm from "@/features/auth/components/login-form";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.login");
  const meta = await getTranslations("meta");

  return {
    title: `${t("title")} · ${meta("description")}`,
    description: t("subtitle"),
  };
}

export default async function LoginPage() {
  const t = await getTranslations("auth.login");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {t("title")}
        </CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>

      <CardFooter className="justify-center gap-1.5">
        <span className="text-muted-foreground">{t("noAccount")}</span>
        <Link
          href="/signup"
          className="font-medium text-primary hover:underline"
        >
          {t("signup")}
        </Link>
      </CardFooter>
    </Card>
  );
}
