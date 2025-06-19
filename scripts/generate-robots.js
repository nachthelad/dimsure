const siteConfig = {
  url: "https://dimsure.vercel.app",
}

const generateRobots = () => {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${siteConfig.url}/sitemap.xml

# AdSense
User-agent: Mediapartners-Google
Allow: /

# Crawl-delay for better performance
Crawl-delay: 1`

  console.log("Generated robots.txt:")
  console.log(robots)
  console.log("✅ Robots.txt generated successfully!")

  return robots
}

generateRobots()
