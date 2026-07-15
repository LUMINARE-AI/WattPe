import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/data/projects";

const BASE_URL = "https://wattpe.com";

const STATIC_ROUTES = [
  "",
  "/how-it-works",
  "/projects",
  "/about-us",
  "/safety-transparency",
  "/faq",
  "/ev-charging",
  "/contact",
  "/legal/terms",
  "/legal/privacy",
  "/legal/disclaimer",
  "/login",
  "/signup",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllProjectSlugs();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...projectEntries];
}
