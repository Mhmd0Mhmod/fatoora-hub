import axios from "axios";
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

    let res;

    switch (request.method) {
      case "GET":
        res = await apiAuth.get(url, { headers });
        break;

      case "POST":
        res = await apiAuth.post(url, data, { headers });
        break;

      case "PUT":
        res = await apiAuth.put(url, data, { headers });
        break;

      case "PATCH":
        res = await apiAuth.patch(url, data, { headers });
        break;

      case "DELETE":
        res = await apiAuth.delete(url, {
          headers,
          data,
        });
        break;

      case "HEAD":
        res = await apiAuth.head(url, { headers });
        break;

      case "OPTIONS":
        res = await apiAuth.options(url, { headers });
        break;

      default:
        return NextResponse.json(
          { message: `Method ${request.method} is not supported` },
          { status: 405 },
        );
    }

    return NextResponse.json(res.data ?? null, {
      status: res.status,
    });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data ?? null, {
        status: err.response.status,
      });
    }

    return NextResponse.json(
      { message: "Something went wrong proxying the request" },
      { status: 502 },
    );
  }
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
