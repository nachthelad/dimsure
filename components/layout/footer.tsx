"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/components/layout/language-provider"
import { APP_CONSTANTS } from "@/lib/constants"
import { FaXTwitter } from "react-icons/fa6"

export function Footer() {
  const { t, locale } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t border-border mt-16 w-full">
      <div className="max-w-none w-full px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/android-chrome-192x192.png" alt="Dimsure Logo" width={24} height={24} className="h-6 w-6" />
              <span className="text-xl font-bold text-foreground">{t("site.name")}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t("footer.description")}</p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">{t("footer.sections.product")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/add-product" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.links.addProduct")}
                </Link>
              </li>
              <li>
                <Link
                  href="/my-contributions"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.links.myContributions")}
                </Link>
              </li>
              <li>
                <Link href="/disputes" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.links.communityDisputes")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.links.blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">{t("footer.sections.company")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.links.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.links.contact")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.links.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.links.terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">{t("footer.sections.getInTouch")}</h3>
            <div className="flex flex-row xl:flex-col gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <a href={`mailto:${APP_CONSTANTS.ADMIN_EMAIL}`} className="hover:text-foreground transition-colors">
                  <span className="xl:hidden"><Mail className="h-5 w-5" /></span>
                  <span className="hidden xl:inline-flex items-center gap-2"><Mail className="h-4 w-4" />{APP_CONSTANTS.ADMIN_EMAIL}</span>
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <a
                  href="https://twitter.com/dimsure_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors text-sm"
                >
                  <span className="xl:hidden"><FaXTwitter className="h-5 w-5" /></span>
                  <span className="hidden xl:inline-flex items-center gap-2"><FaXTwitter className="h-4 w-4" />{t("footer.links.followX")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>{t("footer.copyright", { year: currentYear.toString() })}</div>
          <div className="text-xs">
            {t("footer.poweredBy")}{" "}
            <a
              href="https://nachthelad.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              nachthelad
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t("footer.links.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {t("footer.links.terms")}
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              {t("footer.links.contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
