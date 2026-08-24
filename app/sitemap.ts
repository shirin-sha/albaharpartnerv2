import { MetadataRoute } from "next";

const BASE_URL = "https://www.albaharandpartners.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about-us",
    "/solutions",
    "/brands",
    "/customer-stories",
    "/news-updates",
    "/career",
    "/contact-us",
    "/support",
    "/customer-care-center",
    "/ar",
  ];

  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
