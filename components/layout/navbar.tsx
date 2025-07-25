"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  User,
  MessageSquare,
  BookOpen,
  Menu,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/features/auth-button";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { LanguageToggle } from "@/components/features/language-toggle";
import { useLanguage } from "@/components/layout/language-provider";
import { NotificationBell } from "@/components/features/notification-bell";
import { useAuth } from "@/hooks/useAuth";
import { APP_CONSTANTS } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sidebarForceOpen, setSidebarForceOpen] = useState(false);

  const isAdmin =
    user?.email === APP_CONSTANTS.ADMIN_EMAIL ||
    user?.email === APP_CONSTANTS.DEBUG_AUTHORIZED_EMAIL;

  // Close sheet when pathname changes
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  const navigation = [
    { name: t("navigation.addProduct"), href: "/add-product", icon: Plus },
    { name: t("navigation.search"), href: "/search", icon: Search },
    {
      name: t("navigation.myContributions"),
      href: "/my-contributions",
      icon: User,
    },
    {
      name: t("navigation.communityDisputes"),
      href: "/disputes",
      icon: MessageSquare,
    },
    { name: t("navigation.blog"), href: "/blog", icon: BookOpen },
  ];

  // Sidebar classes
  const sidebarExpandedWidth = locale === "es" ? "xl:w-80" : "xl:w-72";
  const sidebarHoverWidth = locale === "es" ? "xl:hover:w-80" : "xl:hover:w-72";
  const sidebarClass = `hidden xl:flex xl:flex-col xl:fixed xl:inset-y-0 xl:left-0 xl:w-20 ${sidebarHoverWidth} ${
    sidebarForceOpen ? `${sidebarExpandedWidth} sidebar-force-open` : ""
  } xl:bg-background xl:border-r xl:border-border xl:z-50 xl:transition-all xl:duration-200 xl:ease-in-out xl:overflow-hidden group`;

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className={sidebarClass}>
        <div className="flex flex-col h-full">
          {/* App Name + Logo */}
          <Link
            href="/"
            className="flex items-center h-16 border-b border-border px-4 xl:px-6 xl:group-hover:px-6 transition-all duration-200 ease-in-out"
          >
            {/* Logo para light mode */}
            <Image
              src="/color/color-android-chrome-192x192.png"
              alt="Dimsure Logo Color"
              width={32}
              height={32}
              className="h-8 w-8 block dark:hidden flex-shrink-0"
            />
            {/* Logo para dark mode */}
            <Image
              src="/android-chrome-192x192.png"
              alt="Dimsure Logo"
              width={32}
              height={32}
              className="h-8 w-8 hidden dark:block flex-shrink-0"
            />
            <span className="text-2xl font-bold text-foreground opacity-0 xl:group-hover:opacity-100 ml-2 transition-all duration-200 whitespace-nowrap">
              {t("site.name")}
            </span>
          </Link>
          {/* Navigation */}
          <nav className="flex-1 py-6">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href} className="block">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full h-12 flex items-center py-3 text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-200",
                        pathname === item.href ? "font-bold" : "font-normal",
                        "px-4 justify-center",
                        "xl:group-hover:justify-start xl:group-hover:px-4 xl:sidebar-force-open:justify-start xl:sidebar-force-open:px-4"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-all duration-200",
                          pathname === item.href
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                        strokeWidth={pathname === item.href ? 3 : 2}
                      />
                      <span
                        className={cn(
                          "transition-all duration-200 whitespace-nowrap overflow-hidden",
                          "opacity-0 absolute ml-0",
                          "xl:group-hover:static xl:group-hover:opacity-100 xl:group-hover:ml-3 xl:sidebar-force-open:static xl:sidebar-force-open:opacity-100 xl:sidebar-force-open:ml-3"
                        )}
                      >
                        {item.name}
                      </span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
          {/* Bottom Section */}
          <div className="flex flex-col items-center gap-3 px-2 pb-6 mt-auto">
            <div className="flex flex-col xl:group-hover:flex-row items-center justify-center gap-3 bg-muted/10 rounded-xl p-2 transition-all duration-200">
              <ThemeToggle />
              <NotificationBell setSidebarForceOpen={setSidebarForceOpen} />
            </div>
            <Separator className="my-3 w-full" />
            <div className="flex justify-center w-full px-2">
              <AuthButton />
            </div>
            {/* Admin Link */}
            {isAdmin && (
              <>
                <Separator className="my-3 w-full" />
                <Link href="/admin" className="w-full">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full h-12 flex items-center py-3 text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-200",
                      pathname.startsWith("/admin")
                        ? "font-bold"
                        : "font-normal",
                      "px-4 justify-center",
                      "xl:group-hover:justify-start xl:group-hover:px-4 xl:sidebar-force-open:justify-start xl:sidebar-force-open:px-4"
                    )}
                  >
                    <Settings
                      className={cn(
                        "h-5 w-5 flex-shrink-0 transition-all duration-200",
                        pathname.startsWith("/admin")
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                      strokeWidth={pathname.startsWith("/admin") ? 3 : 2}
                    />
                    <span
                      className={cn(
                        "transition-all duration-200 whitespace-nowrap overflow-hidden",
                        "opacity-0 absolute ml-0",
                        "xl:group-hover:static xl:group-hover:opacity-100 xl:group-hover:ml-3 xl:sidebar-force-open:static xl:sidebar-force-open:opacity-100 xl:sidebar-force-open:ml-3"
                      )}
                    >
                      Admin
                    </span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Topbar Mobile */}
      <nav className="xl:hidden bg-background border-b border-border sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo only on mobile */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/android-chrome-192x192.png"
                alt="Dimsure Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </Link>
            <div className="flex items-center space-x-2">
              <LanguageToggle />
              <ThemeToggle />
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through the application
                  </SheetDescription>
                  <div className="flex flex-col space-y-2 mt-8">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.name} href={item.href}>
                          <Button
                            variant={
                              pathname === item.href ? "default" : "ghost"
                            }
                            className="w-full justify-start space-x-2"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Button>
                        </Link>
                      );
                    })}
                    {isAdmin && (
                      <Link href="/admin">
                        <Button
                          variant={
                            pathname.startsWith("/admin") ? "default" : "ghost"
                          }
                          className="w-full justify-start space-x-2"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Administración</span>
                        </Button>
                      </Link>
                    )}
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
    </>
  );
}
