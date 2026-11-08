import type { MetadataRoute } from "next";
import { th } from "@/i18n/dict/th";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: th.seo.homeTitle,
    short_name: "Little Ummah",
    description: th.seo.description,
    lang: "th",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // src/app/globals.css: --color-sky-deep and --color-sky-pale.
    theme_color: "#4fa8e8",
    background_color: "#eaf6ff",
    icons: [{ src: "/Character/welcome.webp", sizes: "400x400", type: "image/webp", purpose: "any" }],
  };
}
