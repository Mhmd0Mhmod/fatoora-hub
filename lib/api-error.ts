/**
 * The API returns RFC 7807 `application/problem+json`:
 * `{ type, title, status, detail?, traceId?, errors: [{ code, message, field? }] }`.
 * Falls back through the most specific fields before using `fallback`.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  const data = (
    error as { response?: { data?: ApiProblemDetails } } | undefined
  )?.response?.data;

  if (!data) return fallback;

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors
      .map((item) => (item.field ? `${item.field}: ${item.message}` : item.message))
      .join("\n");
  }

  return data.detail?.trim() || data.title?.trim() || fallback;
}

export interface ApiProblemDetails {
  type?: string;
  title?: string;
  status?: number | string;
  detail?: string | null;
  traceId?: string | null;
  errors?: {
    code: string;
    message: string;
    field?: string | null;
  }[];
}
