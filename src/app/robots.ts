import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/student-life"],
        disallow: ["/api/", "/login", "/register"],
      },
    ],
    sitemap: "https://student-life.app/sitemap.xml",
  };
}
