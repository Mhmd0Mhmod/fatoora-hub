import axios, { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

import apiAuth from "@/lib/api-auth";

async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api/, "") || "/";
  const url = `${path}${request.nextUrl.search}`;

  try {
    const headers: Record<string, string> = {};

    request.headers.forEach((value, key) => {
      if (!["host", "content-length"].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });
    let data: unknown;

    if (request.method !== "GET" && request.method !== "HEAD") {
      const contentType = request.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        data = await request.json().catch(() => undefined);
      } else {
        data = await request.arrayBuffer();
      }
    }

    // Always read the upstream body as raw bytes so binary endpoints
    // (e.g. invoice PDFs) survive the hop; JSON is decoded below.
    const responseType = "arraybuffer" as const;

    let res;

    switch (request.method) {
      case "GET":
        res = await apiAuth.get(url, { headers, responseType });
        break;

      case "POST":
        res = await apiAuth.post(url, data, { headers, responseType });
        break;

      case "PUT":
        res = await apiAuth.put(url, data, { headers, responseType });
        break;

      case "PATCH":
        res = await apiAuth.patch(url, data, { headers, responseType });
        break;

      case "DELETE":
        res = await apiAuth.delete(url, {
          headers,
          data,
          responseType,
        });
        break;

      case "HEAD":
        res = await apiAuth.head(url, { headers, responseType });
        break;

      case "OPTIONS":
        res = await apiAuth.options(url, { headers, responseType });
        break;

      default:
        return NextResponse.json(
          { message: `Method ${request.method} is not supported` },
          { status: 405 },
        );
    }

    return buildResponse(res);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return buildResponse(err.response, err.response.data);
    }

    return NextResponse.json(
      { message: "Something went wrong proxying the request" },
      { status: 502 },
    );
  }
}

/** Decodes JSON bodies, passes binary bodies (PDFs) straight through. */
function buildResponse(res: AxiosResponse, data: unknown = res.data) {
  const contentType = String(res.headers["content-type"] ?? "");

  // Node's axios hands back a Buffer (a Uint8Array view), never an ArrayBuffer.
  const bytes =
    data instanceof ArrayBuffer
      ? new Uint8Array(data)
      : ArrayBuffer.isView(data)
        ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
        : null;

  if (bytes ? bytes.byteLength === 0 : data === undefined || data === null) {
    return NextResponse.json(null, { status: res.status });
  }

  if (contentType.includes("json")) {
    return NextResponse.json(
      bytes ? JSON.parse(new TextDecoder().decode(bytes)) : data,
      { status: res.status },
    );
  }

  return new NextResponse(data as BodyInit, {
    status: res.status,
    headers: {
      "Content-Type": contentType || "application/octet-stream",
      ...(res.headers["content-disposition"]
        ? { "Content-Disposition": res.headers["content-disposition"] }
        : {}),
    },
  });
}

export async function GET(request: NextRequest) {
  return proxy(request);
}

export async function POST(request: NextRequest) {
  return proxy(request);
}

export async function PUT(request: NextRequest) {
  return proxy(request);
}

export async function PATCH(request: NextRequest) {
  return proxy(request);
}

export async function DELETE(request: NextRequest) {
  return proxy(request);
}
