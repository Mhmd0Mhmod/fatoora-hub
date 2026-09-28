"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/features/auth/actions";

export default function DashboardUserButton() {
  const t = useTranslations("dashboard");
  const tUser = useTranslations("dashboard.user");
  const locale = useLocale();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  if (!user) return null;
  const initials = user.email.slice(0, 2).toUpperCase();

  function handleLogout() {
    startTransition(async () => {
      try {
        await logoutAction(locale);
      } catch {
        // logoutAction redirects on success, so a throw means it failed.
        queryClient.clear();
        toast.error(tUser("logoutError"));
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <Avatar size="sm">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-40 truncate text-sm font-medium sm:inline">
            {user.email}
          </span>
          <ChevronsUpDown className="hidden size-3.5 text-muted-foreground sm:inline-block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{user.email}</span>
          {user.role ? (
            <span className="text-xs font-normal text-muted-foreground">
              {user.role}
            </span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings />
              {t("sidebar.settings")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onSelect={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          <LogOut />
          {isPending ? tUser("loggingOut") : t("user.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
