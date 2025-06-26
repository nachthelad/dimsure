const fs = require("fs")
const path = require("path")

const siteConfig = {
  url: "https://dimsure.online",
}

const generateRobots = () => {
  const robots = `User-agent: *
Allow: /

# Prevent indexing admin-like paths
Disallow: /my-contributions
Disallow: /disputes
Disallow: /add-product

# Sitemap location
Sitemap: ${siteConfig.url}/sitemap.xml

# Special rules for Google AdSense crawler
User-agent: Mediapartners-Google
Allow: /

# Respectful crawling
Crawl-delay: 1

# Dimsure is under development – site rules may change
# Generated: ${new Date().toISOString().split("T")[0]}
`

  const filePath = path.join(__dirname, "../public/robots.txt")
  fs.writeFileSync(filePath, robots)
  console.log("✅ robots.txt generated and saved at: public/robots.txt")
}

generateRobots()
