export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://frontend-omigees-projects.vercel.app/sitemap.xml",
  };
}
