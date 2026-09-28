"use client";

import { formatDate } from "date-fns";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import {
  DataTable,
  DataTableColumn,
} from "@/features/dashboard/components/data-table";

import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
} from "../hooks/use-api-keys";
import { APIKey } from "../types";

export function ApiKeysView() {
  const t = useTranslations("dashboard.apiKeys");

  const query = useApiKeys();
  const revoke = useRevokeApiKey();
  const [pendingRevoke, setPendingRevoke] = useState<APIKey | null>(null);

  const columns: DataTableColumn<APIKey>[] = [
    {
      key: "prefix",
      header: t("colKey"),
      cell: (key) => (
        <span className="font-mono text-xs font-medium">{key.prefix}…</span>
      ),
    },
    {
      key: "device",
      header: t("colDevice"),
      cell: (key) => (
        <div className="flex flex-col">
          <span className="font-medium">{key.deviceName}</span>
          <span className="text-xs text-muted-foreground">
            {key.taxpayerName}
          </span>
        </div>
      ),
    },
    {
      key: "environment",
      header: t("colEnvironment"),
      cell: (key) => (
        <span className="text-muted-foreground">
          {t(`environment.${key.environment}`)}
        </span>
      ),
    },
    {
      key: "status",
      header: t("colStatus"),
      cell: (key) => (
        <Badge variant={key.status === "Active" ? "default" : "secondary"}>
          {t(`status.${key.status}`)}
        </Badge>
      ),
    },
    {
      key: "lastUsed",
      header: t("colLastUsed"),
      cell: (key) => (
        <span className="text-muted-foreground tabular-nums">
          {key.lastUsedAtUtc ? formatDate(key.lastUsedAtUtc, "P") : "—"}
        </span>
      ),
    },
    {
      key: "expires",
      header: t("colExpires"),
      cell: (key) => (
        <span className="text-muted-foreground tabular-nums">
          {key.expiresAtUtc ? formatDate(key.expiresAtUtc, "P") : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "end",
      cell: (key) => (
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={key.status === "Suspended" || revoke.isPending}
          aria-label={t("revoke")}
          onClick={() => setPendingRevoke(key)}
        >
          <Trash2 />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CreateKeyDialog />
      </div>

      {query.isError ? (
        <Alert variant="destructive">
          <AlertTitle>{t("errorTitle")}</AlertTitle>
          <AlertDescription>{t("errorDescription")}</AlertDescription>
        </Alert>
      ) : (
        <DashboardSection contentClassName="px-4">
          <DataTable
            columns={columns}
            items={query.data ?? []}
            getRowId={(key) => key.id}
            loading={query.isLoading}
            fetching={query.isFetching}
            error={query.isError}
            errorTitle={t("errorTitle")}
            errorDescription={t("errorDescription")}
            empty={{
              icon: <KeyRound />,
              title: t("emptyTitle"),
              description: t("emptyDescription"),
            }}
          />
        </DashboardSection>
      )}

      <AlertDialog
        open={Boolean(pendingRevoke)}
        onOpenChange={(open) => {
          if (!open) setPendingRevoke(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("revokeTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("revokeDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const target = pendingRevoke;
                if (!target) return;
                revoke.mutate(target.id, {
                  onSuccess: () => {
                    toast.success(t("revokeSuccess"));
                    setPendingRevoke(null);
                  },
                  onError: () => toast.error(t("revokeError")),
                });
              }}
            >
              {t("revoke")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CreateKeyDialog() {
  const t = useTranslations("dashboard.apiKeys");
  const create = useCreateApiKey();

  const [open, setOpen] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  function reset() {
    setDeviceId("");
    setExpiresInDays("");
    setCreatedKey(null);
    create.reset();
  }

  function handleSubmit() {
    const days = expiresInDays.trim() ? Number(expiresInDays) : undefined;

    create.mutate(
      {
        deviceId: deviceId.trim(),
        ...(days ? { expiresInDays: days } : {}),
      },
      {
        onSuccess: (data) => {
          setCreatedKey(data.clearTextApiKey);
          toast.success(t("createSuccess"));
        },
        onError: () => toast.error(t("createError")),
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          {t("create")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {createdKey ? t("createdTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription>
            {createdKey ? t("createdDescription") : t("createDescription")}
          </DialogDescription>
        </DialogHeader>

        {createdKey ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border bg-muted p-3">
              <code className="block break-all font-mono text-xs">
                {createdKey}
              </code>
            </div>
            <p className="text-xs text-muted-foreground">{t("copyNow")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="api-key-device">{t("deviceIdLabel")}</FieldLabel>
              <Input
                id="api-key-device"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder={t("deviceIdPlaceholder")}
                autoComplete="off"
              />
              <FieldDescription>{t("deviceIdDescription")}</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="api-key-expiry">
                {t("expiresLabel")}
              </FieldLabel>
              <Input
                id="api-key-expiry"
                type="number"
                min={1}
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                placeholder={t("expiresPlaceholder")}
              />
              <FieldDescription>{t("expiresDescription")}</FieldDescription>
            </Field>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setOpen(false);
              reset();
            }}
          >
            {createdKey ? t("done") : t("cancel")}
          </Button>
          {createdKey ? null : (
            <Button
              onClick={handleSubmit}
              disabled={!deviceId.trim() || create.isPending}
            >
              {create.isPending ? t("creating") : t("create")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
