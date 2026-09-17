"use server";

import { cookies } from "next/headers";
import api from "@/lib/api";
import { LoginInput } from "./vaildators";
import { User } from "./types";

export async function loginAction(data: LoginInput) {
  const res = await api.post<User>("/auth/login", data);

  const setCookie = res.headers["set-cookie"];
  const cookieStore = await cookies();

  if (setCookie) {
    const entries = Array.isArray(setCookie) ? setCookie : [setCookie];
    for (const entry of entries) {
      const [name, value] = entry.split(";", 1)[0]?.split("=", 2) ?? [];
      if (!name) continue;
      cookieStore.set(name.trim(), value.trim(), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
      });
    }
  }

  return res.data;
}
