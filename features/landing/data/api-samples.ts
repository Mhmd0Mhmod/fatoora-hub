/**
 * Code samples for the landing page.
 *
 * These are identifiers, not prose, so they are deliberately NOT in the
 * message files — a translated JSON body would be a lie about the contract.
 * They are rendered `dir="ltr"` in both locales.
 *
 * Every request and response here is taken from `dashboard-api(3).json`:
 *  - auth is the `.FatooraHub.Session` cookie (the spec's only security scheme)
 *  - `InvoiceMetadataResponse` really has `warnings: string[] | null`
 */

export type Tone =
  | "method"
  | "path"
  | "hdr"
  | "key"
  | "str"
  | "num"
  | "punct"
  | "cmt"
  | "ok";

export type Segment = { t: string; c?: Tone };
export type Line = Segment[];
export type Sample = { id: string; label: string; lines: Line[] };
export type Endpoint = { method: "GET" | "POST" | "DELETE"; path: string };

/** One coloured token. */
const s = (t: string, c?: Tone): Line => [{ t, c }];
const join = (...parts: Line[]): Line => parts.flat();

const method = (t: string) => s(t, "method");
const path = (t: string) => s(t, "path");
const hdr = (t: string) => s(t, "hdr");
const key = (t: string) => s(t, "key");
const str = (t: string) => s(`"${t}"`, "str");
/** HTTP header values are not JSON strings — no quotes. */
const hdrVal = (t: string) => s(t, "str");
const num = (t: number) => s(String(t), "num");
const punct = (t: string) => s(t, "punct");
const cmt = (t: string) => s(t, "cmt");
const ok = (t: string) => s(t, "ok");
const blank = () => s(" ");

const indent = (level: number) => " ".repeat(level * 2);

/** `"key": value,` at the given indent level. `last` drops the comma. */
function field(name: string, value: string | number, level = 1, last = false): Line {
  return join(
    punct(indent(level)),
    key(`"${name}"`),
    punct(": "),
    typeof value === "number" ? num(value) : str(value),
    punct(last ? "" : ","),
  );
}

const open = (level: number) => punct(indent(level) + "{");
/** `{` that continues the current line rather than opening a new one. */
const inlineOpen = () => punct("{");
const close = (level: number, last = false) =>
  punct(indent(level) + "}" + (last ? "" : ","));

function requestHeader(verb: string, target: string, cookie: string): Line[] {
  return [
    join(method(verb), punct(" "), path(target)),
    join(hdr("Content-Type:"), punct(" "), hdrVal("application/json")),
    join(hdr("Cookie:"), punct(" "), hdrVal(cookie)),
    blank(),
  ];
}

const COOKIE = ".FatooraHub.Session=…";

const simpleLines: Line[] = [
  ...requestHeader("POST", "/api/v1/invoices/simple", COOKIE),
  open(0),
  field("invoiceNumber", "INV-2026-0001"),
  field("paymentMeansCode", "10"),
  field("issueDateTime", "2026-09-20T14:30:00Z"),
  field("invoiceType", "Invoice"),
  field("note", "POS Terminal 01"),
  join(punct(indent(1)), key('"lines"'), punct(": [")),
  open(2),
  field("itemName", "Wireless Barcode Scanner", 3),
  field("quantity", 2, 3),
  field("unitPrice", 150.0, 3),
  field("discountAmount", 10.0, 3),
  field("taxCategory", "S", 3),
  field("taxRate", 15.0, 3, true),
  close(2, true),
  punct(indent(1) + "],"),
  join(punct(indent(1)), key('"customer"'), punct(": "), inlineOpen()),
  field("legalName", "Walk-in Customer", 2, true),
  close(1, true),
  close(0, true),
];

const standardLines: Line[] = [
  ...requestHeader("POST", "/api/v1/invoices/standard", COOKIE),
  open(0),
  field("invoiceNumber", "INV-2026-0002"),
  field("paymentMeansCode", "42"),
  field("actualDeliveryDate", "2026-09-20"),
  join(punct(indent(1)), key('"customer"'), punct(": "), inlineOpen()),
  field("vat", "300000000000003", 2),
  field("legalName", "Acme Trading Co.", 2),
  field("streetName", "King Fahd Road", 2),
  field("buildingNumber", "1234", 2),
  field("citySubdivisionName", "Olaya", 2),
  field("cityName", "Riyadh", 2),
  field("postalZone", "12211", 2),
  field("countryCode", "SA", 2, true),
  close(1),
  join(punct(indent(1)), key('"lines"'), punct(": [")),
  open(2),
  field("itemName", "IT Consulting Services", 3),
  field("quantity", 10, 3),
  field("unitPrice", 150.0, 3),
  field("taxCategory", "S", 3),
  field("taxRate", 15.0, 3, true),
  close(2, true),
  punct(indent(1) + "]"),
  close(0, true),
];

const responseLines: Line[] = [
  join(hdr("HTTP/1.1 "), ok("200 OK")),
  join(hdr("Content-Type:"), punct(" "), hdrVal("application/json")),
  blank(),
  open(0),
  field("invoiceNumber", "INV-2026-0001"),
  field("uuid", "7f8b548b-e822-482f-b4df-ec269d51934c"),
  field("icv", 42),
  field("invoiceHash", "NWY2OWQ0YWU3YjMyMjkwMDM5MGZl…"),
  field("status", "Pending"),
  field("invoiceType", "Simplified"),
  field("submittedAtUtc", "2026-09-20T14:30:01Z"),
  field("qrCode", "ARdTYW1wbGUgQ29tcGFueSBOYW1l…"),
  field("warnings", "ZATCA returned a non-blocking notice", 1, true),
  close(0, true),
];

const pdfLines: Line[] = [
  join(method("GET"), punct(" "), path("/api/v1/invoices/INV-2026-0001/pdf")),
  join(hdr("Cookie:"), punct(" "), hdrVal(COOKIE)),
  blank(),
  join(
    cmt("→ "),
    ok("200 OK"),
    cmt(" · PDF/A-3 with the signed UBL 2.1 XML embedded"),
  ),
];

export const apiSamples: Sample[] = [
  { id: "simple", label: "Simplified · B2C POS", lines: simpleLines },
  { id: "standard", label: "Standard · B2B clearance", lines: standardLines },
  { id: "response", label: "Response", lines: responseLines },
  { id: "pdf", label: "PDF/A-3", lines: pdfLines },
];

/**
 * The documented surface, verbatim from `dashboard-api(3).json` with the
 * `/api/v1` prefix trimmed. Listed so the page can't advertise an endpoint
 * the API doesn't have.
 */
export const apiEndpoints: Endpoint[] = [
  { method: "POST", path: "/invoices/simple" },
  { method: "POST", path: "/invoices/standard" },
  { method: "GET", path: "/invoices" },
  { method: "GET", path: "/invoices/{invoiceNumber}" },
  { method: "GET", path: "/invoices/{invoiceNumber}/pdf" },
  { method: "POST", path: "/invoices/{invoiceNumber}/retry" },
  { method: "POST", path: "/invoices/retry-failed" },
  { method: "POST", path: "/taxpayers" },
  { method: "GET", path: "/taxpayers" },
  { method: "POST", path: "/taxpayers/{taxpayerId}/devices" },
  { method: "GET", path: "/taxpayers/{taxpayerId}/devices" },
  { method: "GET", path: "/devices/{deviceId}/health" },
  { method: "POST", path: "/devices/{deviceId}/renew-cert" },
  { method: "GET", path: "/api-keys" },
  { method: "POST", path: "/api-keys" },
  { method: "DELETE", path: "/api-keys/{id}" },
  { method: "GET", path: "/tax-exemptions" },
  { method: "GET", path: "/tax-exemptions/{category}" },
  { method: "GET", path: "/dashboard/summary" },
  { method: "GET", path: "/dashboard/analytics" },
  { method: "GET", path: "/dashboard/activity" },
];
