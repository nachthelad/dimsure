import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { AccountReactivation } from "@/components/features/account-reactivation";
import { UsernameRequirement } from "@/components/features/username-requirement";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider } from "@/components/layout/language-provider";
import { UnitProvider } from "@/components/layout/unit-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/site-config";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import { getServerLocale } from "@/lib/translations";
import { parseCookies, COOKIE_NAMES } from "@/lib/cookies";
import { SchemaScript } from "@/components/seo/schema-script";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo/schema-markup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${siteConfig.name} — Product Dimensions Database for Packaging & Logistics`,
  description:
    "Find accurate product dimensions for packaging optimization. Community-verified measurements for thousands of products. Reduce shipping costs with precise dimension data.",
  keywords: [
    ...siteConfig.keywords,
    "product dimensions",
    "packaging optimization",
    "shipping calculator",
    "box dimensions",
    "logistics",
    "e-commerce packaging",
    "product measurements",
  ].join(", "),
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: `${siteConfig.name} — Product Dimensions Database`,
    description:
      "Community-verified product dimensions for packaging and logistics optimization",
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Product Dimensions Database`,
    description:
      "Community-verified product dimensions for packaging and logistics optimization",
    images: [siteConfig.ogImage],
    creator: "@dimsure_app",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  generator: "Dimsure",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const locale = getServerLocale(cookieHeader, acceptLanguage) as "en" | "es";

  // Detect unit system from cookies
  const cookies = parseCookies(cookieHeader);
  const unitSystem =
    (cookies[COOKIE_NAMES.UNITS] as "metric" | "imperial") || "metric";

  // Detect theme from cookies (next-themes uses 'theme' cookie)
  const theme = (cookies["theme"] as "light" | "dark" | "system") || "dark";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Analytics with Consent Mode */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KY8VFRM514"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent mode
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied'
            });
            
            gtag('js', new Date());
            gtag('config', 'G-KY8VFRM514');
          `}
        </Script>

        {/* Additional meta tags for better SEO */}
        <meta name="google-adsense-account" content="ca-pub-1027418154196814" />
        <meta
          name="google-site-verification"
          content="c1efNuZhhG-SikmDFge_tg2KrONNix0vCkpjSnhCj_o"
        />
        <link rel="canonical" href={siteConfig.url} />

        {/* Favicon and app icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />

        {/* Theme color */}
        <meta name="theme-color" content="#10b981" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        {/* Google Ads - Event snippet for Vista de una página conversion page */}
        <Script id="google-ads-conversion" strategy="afterInteractive">
          {`gtag('event', 'conversion', {'send_to': 'AW-980303157/Me53CNDr45cZELX6uNMD'});`}
        </Script>

        {/* Schema Markup */}
        <SchemaScript schema={generateOrganizationSchema()} />
        <SchemaScript schema={generateWebsiteSchema()} />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme={theme}
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider defaultLocale={locale}>
            <UnitProvider defaultUnitSystem={unitSystem}>
              <TooltipProvider>
                <div className="min-h-screen bg-background xl:flex">
                  <Navbar />
                  <div className="flex-1 flex flex-col min-h-screen xl:ml-20">
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <CookieConsent />
                  <AccountReactivation />
                  <UsernameRequirement />
                </div>
              </TooltipProvider>
            </UnitProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
