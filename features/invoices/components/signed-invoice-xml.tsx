"use client";

import { Check, Copy, Download, FileCode2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "cn";

/** Decodes the API's base64 payload to a UTF-8 string. */
function decodeBase64(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

export function SignedInvoiceXml({
  base64SignedInvoice,
  invoiceNumber,
}: {
  base64SignedInvoice: string | null | undefined;
  invoiceNumber: string;
}) {
  const t = useTranslations("dashboard.invoices.detail");
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!base64SignedInvoice) return null;

  let xml: string;

  try {
    xml = decodeBase64(base64SignedInvoice);
  } catch {
    // Malformed base64 shouldn't take the whole dialog down.
    return (
      <p className="text-xs text-muted-foreground">{t("signedXmlInvalid")}</p>
    );
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(xml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copyError"));
    }
  }

  function handleDownload() {
    const url = URL.createObjectURL(
      new Blob([xml], { type: "application/xml" }),
    );
    const link = document.createElement("a");

    link.href = url;
    link.download = `${invoiceNumber}.xml`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          <FileCode2 />
          {isOpen ? t("signedXmlHide") : t("signedXmlShow")}
        </Button>

        {isOpen ? (
          <div className="ms-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCopy}
              aria-label={t("signedXmlCopy")}
              title={t("signedXmlCopy")}
            >
              {copied ? <Check /> : <Copy />}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDownload}
              aria-label={t("signedXmlDownload")}
              title={t("signedXmlDownload")}
            >
              <Download />
            </Button>
          </div>
        ) : null}
      </div>

      {isOpen ? (
        <ScrollArea className="max-h-64 rounded-lg border bg-muted/40">
          <pre
            dir="ltr"
            className={cn("p-3 font-mono text-xs whitespace-pre-wrap", "pe-4")}
          >
            {xml}
          </pre>
        </ScrollArea>
      ) : null}
    </div>
  );
}
