"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Package, Plus, User, MessageSquare, BookOpen, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { AuthButton } from "@/components/auth-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"

export function Navbar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navigation = [
    { name: t("navigation.addProduct"), href: "/add-product", icon: Plus },
    { name: t("navigation.myContributions"), href: "/my-contributions", icon: User },
    { name: t("navigation.communityDisputes"), href: "/disputes", icon: MessageSquare },
    { name: t("navigation.blog"), href: "/blog", icon: BookOpen },
  ]

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/android-chrome-192x192.png" alt="Dimsure Logo" width={32} height={32} className="h-8 w-8" />
            <span className="text-2xl font-bold text-foreground">{t("site.name")}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={cn("flex items-center space-x-2")}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center space-x-4">
              <Separator orientation="vertical" className="h-6" />
              <LanguageToggle />
              <ThemeToggle />
              <Separator orientation="vertical" className="h-6" />
              <AuthButton />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="xl:hidden flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetTitle>Menu</SheetTitle>
                <div className="flex flex-col space-y-2 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={pathname === item.href ? "default" : "ghost"}
                          className="w-full justify-start space-x-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Button>
                      </Link>
                    )
                  })}
                  <div className="border-t border-border pt-4 mt-4">
                    <AuthButton />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
