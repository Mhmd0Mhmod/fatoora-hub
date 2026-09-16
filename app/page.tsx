import { redirect } from "next/navigation";

// The root `/` is not a locale route (see `localePrefix: "always"` in
// `i18n/routing.ts`), so redirect visitors to the default locale.
export default function RootPage() {
  redirect("/en");
}