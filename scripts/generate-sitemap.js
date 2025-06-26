const siteConfig = {
  name: "Dimsure",
  description:
    "A public, community-powered database of box dimensions for products. Optimize your packaging and logistics with verified data.",
  url: "https://dimsure.online",
  ogImage: "https://dimsure.online/og-image.png",
  creator: "Dimsure Team",
  keywords: [
    "packaging dimensions",
    "box measurements",
    "logistics",
    "shipping",
    "product dimensions",
    "package size",
    "shipping calculator",
  ],
  links: {
    twitter: "https://twitter.com/dimsure_app",
  },
}

const generateSitemap = () => {
  const pages = [
    { url: "/", changefreq: "daily", priority: "1.0" },
    { url: "/add-product", changefreq: "weekly", priority: "0.8" },
    { url: "/about", changefreq: "monthly", priority: "0.7" },
    { url: "/contact", changefreq: "monthly", priority: "0.7" },
    { url: "/blog", changefreq: "weekly", priority: "0.7" },
    { url: "/my-contributions", changefreq: "weekly", priority: "0.6" },
    { url: "/disputes", changefreq: "weekly", priority: "0.6" },
    { url: "/privacy", changefreq: "yearly", priority: "0.5" },
    { url: "/terms", changefreq: "yearly", priority: "0.5" },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteConfig.url}${page.url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

  console.log("Generated sitemap.xml:")
  console.log(sitemap)
  console.log("✅ Sitemap generated successfully!")
  console.log("")
  console.log("📋 Pages included:")
  pages.forEach((page) => {
    console.log(`   • ${siteConfig.url}${page.url} (${page.priority} priority)`)
  })

  return sitemap
}

generateSitemap()
