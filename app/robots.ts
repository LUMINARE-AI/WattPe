import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/finance", "/api", "/unauthorized"],
    },
    sitemap: "https://wattpe.com/sitemap.xml",
  };
}
