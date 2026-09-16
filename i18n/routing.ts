import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ar"],

  // Used when no locale matches
  defaultLocale: "en",

  // Required for static export (`output: "export"`): every route keeps
  // its locale prefix and the root `/` is handled by a redirect page.
  localePrefix: "always",
});
